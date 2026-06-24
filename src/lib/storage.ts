import { createHash, createHmac } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
export const maxFileBytes = 8 * 1024 * 1024;
export const maxOrderUploadBytes = 32 * 1024 * 1024;
const defaultUploadRoot = path.join(process.cwd(), ".data", "uploads");

type StorageDriver = "local" | "s3";

type StorageAdapter = {
  saveOrderFile(orderId: string, file: File): Promise<StoredFile>;
  readFile(fileUrl: string): Promise<Buffer>;
};

type S3Config = {
  accessKeyId: string;
  bucket: string;
  endpoint: URL;
  forcePathStyle: boolean;
  prefix: string;
  region: string;
  secretAccessKey: string;
};

export type StoredFile = { fileUrl: string; fileType: string; originalName: string };

export class StorageConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageConfigurationError";
  }
}

export function isStorageConfigurationError(error: unknown): error is StorageConfigurationError {
  return error instanceof StorageConfigurationError;
}

function safeFileName(name: string) {
  const normalized = name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "-");
  return `${Date.now()}-${normalized}`;
}

function orderFileKey(orderId: string, fileName: string) {
  return path.posix.join("orders", orderId, fileName);
}

function env(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

function requiredEnv(name: string) {
  const value = env(name);
  if (!value) throw new StorageConfigurationError(`Хранилище файлов не настроено: не задана обязательная переменная окружения ${name}.`);
  return value;
}

function storageDriver(): StorageDriver {
  const configuredDriver = env("STORAGE_DRIVER");
  if (!configuredDriver && process.env.NODE_ENV === "production") {
    throw new StorageConfigurationError(
      'Хранилище файлов не настроено: задайте STORAGE_DRIVER="s3" и S3_* переменные или явно задайте STORAGE_DRIVER="local" с постоянным STORAGE_LOCAL_ROOT.'
    );
  }

  const driver = configuredDriver ?? "local";
  if (driver !== "local" && driver !== "s3") {
    throw new StorageConfigurationError('Хранилище файлов не настроено: STORAGE_DRIVER должен быть "local" или "s3".');
  }
  return driver;
}

function localUploadRoot() {
  const configuredRoot = env("STORAGE_LOCAL_ROOT");
  if (process.env.NODE_ENV === "production" && storageDriver() === "local" && !configuredRoot) {
    throw new StorageConfigurationError("Хранилище файлов не настроено: для локального хранилища в production задайте STORAGE_LOCAL_ROOT.");
  }
  return path.resolve(configuredRoot ?? defaultUploadRoot);
}

function normalizeLocalPath(fileUrl: string) {
  const uploadRoot = localUploadRoot();
  const absolutePath = path.join(uploadRoot, fileUrl);
  const normalized = path.normalize(absolutePath);
  if (!normalized.startsWith(uploadRoot + path.sep)) throw new Error("Некорректный путь файла.");
  return normalized;
}

class LocalStorageAdapter implements StorageAdapter {
  async saveOrderFile(orderId: string, file: File): Promise<StoredFile> {
    const relativePath = orderFileKey(orderId, safeFileName(file.name));
    const normalized = normalizeLocalPath(relativePath);

    await mkdir(path.dirname(normalized), { recursive: true });
    await writeFile(normalized, Buffer.from(await file.arrayBuffer()));
    return { fileUrl: relativePath, fileType: file.type, originalName: file.name };
  }

  async readFile(fileUrl: string) {
    return readFile(normalizeLocalPath(fileUrl));
  }
}

function s3Config(): S3Config {
  const endpoint = new URL(requiredEnv("S3_ENDPOINT"));
  return {
    accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
    bucket: requiredEnv("S3_BUCKET"),
    endpoint,
    forcePathStyle: (env("S3_FORCE_PATH_STYLE") ?? "false").toLowerCase() === "true",
    prefix: normalizeS3Prefix(env("S3_PREFIX") ?? ""),
    region: requiredEnv("S3_REGION"),
    secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY")
  };
}

function normalizeS3Prefix(prefix: string) {
  const cleaned = prefix.replace(/^\/+|\/+$/g, "");
  return cleaned ? `${cleaned}/` : "";
}

function s3ObjectKey(config: S3Config, key: string) {
  return `${config.prefix}${key}`;
}

function encodeS3Path(value: string) {
  return value
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function toAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function sha256Hex(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: string | Buffer, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function signingKey(secretAccessKey: string, dateStamp: string, region: string) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const dateRegionKey = hmac(dateKey, region);
  const dateRegionServiceKey = hmac(dateRegionKey, "s3");
  return hmac(dateRegionServiceKey, "aws4_request");
}

function s3Url(config: S3Config, key: string) {
  const url = new URL(config.endpoint.toString());
  const endpointPath = url.pathname.replace(/\/$/, "");
  const encodedKey = encodeS3Path(key);

  if (config.forcePathStyle) {
    url.pathname = `${endpointPath}/${encodeURIComponent(config.bucket)}/${encodedKey}`;
  } else {
    url.hostname = `${config.bucket}.${url.hostname}`;
    url.pathname = `${endpointPath}/${encodedKey}`;
  }

  return url;
}

type SignedS3Request = {
  body?: Uint8Array;
  config: S3Config;
  contentType?: string;
  key: string;
  method: "GET" | "PUT";
};

function signedS3Headers({ body, config, contentType, key, method }: SignedS3Request) {
  const now = new Date();
  const amzDate = toAmzDate(now);
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body ?? new Uint8Array());
  const url = s3Url(config, key);
  const headers: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate
  };
  if (contentType) headers["content-type"] = contentType;

  const sortedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderNames.map((name) => `${name}:${headers[name]}\n`).join("");
  const signedHeaders = sortedHeaderNames.join(";");
  const canonicalRequest = [
    method,
    url.pathname,
    url.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signature = createHmac("sha256", signingKey(config.secretAccessKey, dateStamp, config.region))
    .update(stringToSign)
    .digest("hex");

  return {
    authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    headers,
    url
  };
}

async function s3Fetch(request: SignedS3Request) {
  const { authorization, headers, url } = signedS3Headers(request);
  const requestHeaders = { ...headers };
  delete requestHeaders.host;
  const response = await fetch(url, {
    body: request.body ? (request.body as unknown as BodyInit) : undefined,
    headers: { ...requestHeaders, Authorization: authorization },
    method: request.method
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`S3 storage request failed: ${response.status} ${response.statusText} ${detail}`.trim());
  }

  return response;
}

class S3StorageAdapter implements StorageAdapter {
  private readonly config = s3Config();

  async saveOrderFile(orderId: string, file: File): Promise<StoredFile> {
    const key = s3ObjectKey(this.config, orderFileKey(orderId, safeFileName(file.name)));
    const body = new Uint8Array(await file.arrayBuffer());
    await s3Fetch({ body, config: this.config, contentType: file.type, key, method: "PUT" });
    return { fileUrl: key, fileType: file.type, originalName: file.name };
  }

  async readFile(fileUrl: string) {
    const response = await s3Fetch({ config: this.config, key: fileUrl, method: "GET" });
    return Buffer.from(await response.arrayBuffer());
  }
}

function storageAdapter(): StorageAdapter {
  return storageDriver() === "s3" ? new S3StorageAdapter() : new LocalStorageAdapter();
}

export function protectedFileUrl(fileId: string) {
  return `/api/files/${fileId}`;
}

export function validateAggregateUploadSize(files: File[]) {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > maxOrderUploadBytes) throw new Error("Суммарный размер файлов не должен превышать 32 МБ.");
}

export async function saveOrderFile(orderId: string, file: File): Promise<StoredFile> {
  if (!allowedTypes.has(file.type)) throw new Error("Разрешены только jpg, png, webp и pdf файлы.");
  if (file.size > maxFileBytes) throw new Error("Размер файла не должен превышать 8 МБ.");

  return storageAdapter().saveOrderFile(orderId, file);
}

export async function readStoredFile(fileUrl: string) {
  return storageAdapter().readFile(fileUrl);
}
