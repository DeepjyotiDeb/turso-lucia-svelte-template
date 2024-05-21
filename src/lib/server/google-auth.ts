import {
  DEV_GOOGLE_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from '$env/static/private';
import { Google } from 'arctic';

const redirectUri = import.meta.env.DEV ? DEV_GOOGLE_REDIRECT_URI : GOOGLE_REDIRECT_URI;
export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
