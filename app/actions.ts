'use server'

import { query } from '@/lib/db';
import { createSession, deleteSession, verifySession } from '@/lib/sessions';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const TradeSchema = z.object({
  skill_offered: z.string().min(2, "Skill must be at least 2 chars"),
  skill_wanted: z.string().min(2, "Skill must be at least 2 chars"),
  description: z.string().min(10, "Description must be at least 10 chars"),
});

export async function getCurrentUser() {
  const userId = await verifySession();
  return userId ? parseInt(userId) : null;
}

export async function signup(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) return { message: "All fields required" };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [name, email, hashedPassword]
    );

    await createSession(result.rows[0].id.toString());
  } catch (error) {
    return { message: "Email already exists" };
  }

  redirect('/');
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user || !user.password) {
      return { message: "Invalid credentials" };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { message: "Invalid credentials" };
    }

    await createSession(user.id.toString());
  } catch (error) {
    return { message: "Database error" };
  }

  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function getTrades() {
  const result = await query(`
    SELECT 
      t.*, 
      u.name as user_name, 
      u.email as user_email
    FROM trades t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `);
  return result.rows;
}

export async function createTrade(prevState: any, formData: FormData) {
  const userId = await getCurrentUser();

  if (!userId) {
    return { message: "You must be logged in to post." };
  }

  const validatedFields = TradeSchema.safeParse({
    skill_offered: formData.get('skill_offered'),
    skill_wanted: formData.get('skill_wanted'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return { message: "Invalid input. Check description length." };
  }

  const { skill_offered, skill_wanted, description } = validatedFields.data;

  try {
    await query(
      `INSERT INTO trades (user_id, skill_offered, skill_wanted, description) 
       VALUES ($1, $2, $3, $4)`,
      [userId, skill_offered, skill_wanted, description]
    );
  } catch (error) {
    console.error('Database Error:', error);
    return { message: "Database failed to create trade." };
  }

  revalidatePath('/');
  redirect('/');
}

export async function updateTrade(tradeId: number, formData: FormData) {
  const userId = await getCurrentUser();
  if (!userId) return { message: "Unauthorized" };

  const skill_offered = formData.get('skill_offered') as string;
  const skill_wanted = formData.get('skill_wanted') as string;
  const description = formData.get('description') as string;

  try {
    await query(
      `UPDATE trades 
       SET skill_offered = $1, skill_wanted = $2, description = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5`,
      [skill_offered, skill_wanted, description, tradeId, userId]
    );
  } catch (error) {
    return { message: "Failed to update" };
  }

  revalidatePath('/');
  return { message: "Updated successfully" };
}

export async function toggleTradeStatus(tradeId: number, newStatus: 'OPEN' | 'CLOSED') {
  const userId = await getCurrentUser();
  if (!userId) return { message: "Unauthorized" };

  try {
    await query(
      `UPDATE trades SET status = $1 WHERE id = $2 AND user_id = $3`,
      [newStatus, tradeId, userId]
    );
  } catch (error) {
    return { message: "Failed to update status" };
  }

  revalidatePath('/');
}

export async function deleteTrade(tradeId: number) {
  const userId = await getCurrentUser();
  if (!userId) return { message: "Not authorized" };

  try {
    await query(
      `DELETE FROM trades WHERE id = $1 AND user_id = $2`,
      [tradeId, userId]
    );
  } catch (error) {
    return { message: "Failed to delete" };
  }

  revalidatePath('/');
}