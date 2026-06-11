import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
 const admin=await prisma.user.upsert({where:{email:"admin@vtop.studio"},update:{},create:{email:"admin@vtop.studio",name:"Администратор",role:"ADMIN",passwordHash:await bcrypt.hash("admin123",10)}});
 const user=await prisma.user.upsert({where:{email:"client@example.com"},update:{},create:{email:"client@example.com",name:"Тестовый клиент",passwordHash:await bcrypt.hash("client123",10)}});
 const services=[
  {slug:"logo",title:"Логотип для бренда",shortDescription:"3 AI-концепции и доработка дизайнером",description:"Создаём основу фирменного знака по брифу: стиль, цвета, ассоциации, ограничения и варианты применения.",basePrice:"4900",fieldsConfig:{fields:[{name:"brand",label:"Название бренда",required:true},{name:"industry",label:"Сфера бизнеса",required:true},{name:"audience",label:"Целевая аудитория",type:"textarea",required:true},{name:"style",label:"Желаемый стиль",placeholder:"минимализм, премиум, playful..."},{name:"colors",label:"Цвета и ограничения"}]},promptTemplate:"Создай логотип для бренда {{brand}} в сфере {{industry}}. Аудитория: {{audience}}. Стиль: {{style}}. Цвета/ограничения: {{colors}}."},
  {slug:"banner",title:"Рекламный баннер",shortDescription:"Баннер для сайта или соцсетей",description:"Готовим визуальную концепцию рекламного баннера с оффером, CTA и адаптацией под канал размещения.",basePrice:"2900",fieldsConfig:{fields:[{name:"product",label:"Продукт или акция",required:true},{name:"channel",label:"Площадка размещения",required:true},{name:"offer",label:"Оффер и CTA",type:"textarea",required:true},{name:"format",label:"Формат/размер"}]},promptTemplate:"Сделай рекламный баннер для {{product}} под площадку {{channel}}. Оффер и CTA: {{offer}}. Формат: {{format}}."},
  {slug:"social-kit",title:"Визуал для соцсетей",shortDescription:"Набор постов в едином стиле",description:"Формируем визуальную систему для контент-серии: обложки, посты, сторис и рекомендации по стилю.",basePrice:"6900",fieldsConfig:{fields:[{name:"topic",label:"Тематика аккаунта",required:true},{name:"posts",label:"Какие посты нужны",type:"textarea",required:true},{name:"tone",label:"Тональность бренда"},{name:"references",label:"Референсы"}]},promptTemplate:"Подготовь визуальный набор для соцсетей на тему {{topic}}. Посты: {{posts}}. Тональность: {{tone}}. Референсы: {{references}}."}
 ];
 for(const s of services) await prisma.service.upsert({where:{slug:s.slug},update:s,create:s as any});
 const logo=await prisma.service.findUniqueOrThrow({where:{slug:"logo"}});
 const order=await prisma.order.create({data:{userId:user.id,serviceId:logo.id,price:logo.basePrice,briefData:{brand:"Demo Coffee",industry:"кофейня",audience:"молодые профессионалы"},generatedPrompt:"Демо-промпт для логотипа кофейни",status:"IN_PROGRESS",paymentStatus:"MANUAL_CONFIRMED"}});
 await prisma.designResult.create({data:{orderId:order.id,title:"Черновая концепция",description:"Пример результата для демонстрации кабинета.",imageUrl:"/placeholder-result.png"}});
 console.log({admin:admin.email,user:user.email});
}
main().finally(()=>prisma.$disconnect());
