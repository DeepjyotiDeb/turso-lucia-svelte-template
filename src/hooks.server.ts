import { building } from '$app/environment';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const handleError: HandleServerError = async ({ error, event }) => {
  const errorId = crypto.randomUUID();

  event.locals.error = error?.toString() || '';
  if (error instanceof Error) {
    event.locals.errorStackTrace = error.stack || '';
  } else {
    event.locals.errorStackTrace = '';
  }
  event.locals.errorId = errorId;
  // log(500, event);

  return {
    message: 'An unexpected error occurred.',
    errorId,
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  if (building) {
    const response = await resolve(event);
    return response; // bailing here allows the 404 page to build
  }
  const sessionId = event.cookies.get(lucia.sessionCookieName || '');

  let user = null;
  let session = null;
  // try {
  if (sessionId) {
    const validationResponse = await lucia.validateSession(sessionId);
    session = validationResponse.session;
    user = validationResponse.user;

    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });
    } else if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });
    }
  }

  event.locals.user = user;
  event.locals.session = session;

  if (event.route.id?.startsWith('/(protected)')) {
    if (!user) redirect(302, '/');
  }

  return resolve(event);
  // } catch (error) {
  // 	console.log('error in hooks', error);
  // 	return resolve(event);
  // }
};
