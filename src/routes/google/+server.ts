import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '$lib/server/google-auth';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const codeVerfier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerfier, {
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  event.cookies.set('google_oauth_state', state, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  event.cookies.set('google_oauth_code_verifier', codeVerfier, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  redirect(302, url.toString());
}
