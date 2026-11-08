import test from 'node:test';
import assert from 'node:assert';
import {
  validateSupabaseUrl,
  validateSupabaseAnonKey,
  generateSupabaseClientCode,
  generateSupabaseEnv,
  SUPABASE_SQL_PRESETS,
  DEMO_SUPABASE_CONFIG,
} from './supabaseHelper.ts';

test('validateSupabaseUrl validates correct HTTP/HTTPS URLs', () => {
  assert.strictEqual(validateSupabaseUrl('https://xyz.supabase.co'), true);
  assert.strictEqual(validateSupabaseUrl('http://localhost:54321'), true);
  assert.strictEqual(validateSupabaseUrl('invalid-url'), false);
  assert.strictEqual(validateSupabaseUrl(''), false);
});

test('validateSupabaseAnonKey checks token length', () => {
  assert.strictEqual(validateSupabaseAnonKey('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token'), true);
  assert.strictEqual(validateSupabaseAnonKey('short'), false);
  assert.strictEqual(validateSupabaseAnonKey(''), false);
});

test('generateSupabaseClientCode produces valid TypeScript with createClient', () => {
  const code = generateSupabaseClientCode(DEMO_SUPABASE_CONFIG);
  assert.match(code, /import { createClient } from '@supabase\/supabase-js'/);
  assert.match(code, /athokpam-demo\.supabase\.co/);
  assert.match(code, /export const supabase = createClient/);
});

test('generateSupabaseEnv includes VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', () => {
  const env = generateSupabaseEnv(DEMO_SUPABASE_CONFIG);
  assert.match(env, /VITE_SUPABASE_URL=https:\/\/athokpam-demo\.supabase\.co/);
  assert.match(env, /VITE_SUPABASE_ANON_KEY=/);
});

test('SUPABASE_SQL_PRESETS provides production schemas', () => {
  assert.strictEqual(SUPABASE_SQL_PRESETS.length >= 3, true);
  const profilesPreset = SUPABASE_SQL_PRESETS.find((p) => p.id === 'profiles-auth');
  assert.ok(profilesPreset);
  assert.match(profilesPreset.sql, /create table if not exists public\.profiles/);
});
