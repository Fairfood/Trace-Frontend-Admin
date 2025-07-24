export interface IdTokenRequest {
  client_id?: string;
  client_secret?: string;
  code: string;
  redirect_uri?: string;
  grant_type?: string;
}

export interface IdTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
}

export interface IconConfig {
  isMatIcon: boolean;
  icon: string;
}
export interface IList {
  title: string;
  description: string;
  leftIcon?: IconConfig;
  rightIcon?: IconConfig;
}

export interface IRefreshTokenApi {
  refresh_token: string;
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
}

export interface ICommonObj {
  id: string;
  name: string;
  selected?: boolean;
}

export interface IListWithIndex {
  item: IList;
  index: number;
}

export interface IList {
  title: string;
  description: string;
  leftIcon?: IconConfig;
  rightIcon?: IconConfig;
}

export interface IconConfig {
  isMatIcon: boolean;
  icon: string;
}
