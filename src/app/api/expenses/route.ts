import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  quantity: z.number().int().nonnegative('Количество должно быть неотрицательным'),
  price: z.number().positive('Цена должна быть положительной'),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('GET /api/products error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: 'Ошибка сервера при получении данных', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, quantity, price } = productSchema.parse(body);
    const product = await prisma.product.create({
      data: { name, quantity, price },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/products error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: 'Ошибка при добавлении записи', details: error.message },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
