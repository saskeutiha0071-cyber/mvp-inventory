import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const expenseSchema = z.object({
  description: z.string().min(1, 'Описание обязательно'),
  amount: z.number().positive('Сумма должна быть положительной'),
});

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany();
    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error('GET /api/expenses error:', {
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
    const { description, amount } = expenseSchema.parse(body);
    const expense = await prisma.expense.create({
      data: { description, amount },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/expenses error:', {
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
