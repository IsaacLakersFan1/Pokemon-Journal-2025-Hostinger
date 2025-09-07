declare module 'basketball-court' {
  interface BasketballCourtOptions {
    width?: number;
    halfCourt?: boolean;
    theme?: string;
  }

  interface BasketballCourt {
    toDom(): SVGElement;
    toSvg(): string;
  }

  function basketballCourt(options?: BasketballCourtOptions): BasketballCourt;
  export = basketballCourt;
}
