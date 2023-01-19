import { createAction, props } from '@ngrx/store';
import { TokenData } from '../models/TokenData';

export const setTokenData = createAction('[Set] TokenData', props<{tokenData: TokenData | null}>());
