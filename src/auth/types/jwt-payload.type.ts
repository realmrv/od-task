export type JwtPayload = {
  /**
   * The email of the user
   */
  email: string;

  /**
   * The subject - user unique id
   */
  sub: string;
};
