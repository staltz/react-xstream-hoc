import {Stream, Subscription} from 'xstream';
import {Component, createElement, ComponentClass as CClass} from 'react';

export type XstreamProps<P, K extends keyof P> = {
  [Key in K]: P[Key] | Stream<P[Key]>
};

export function withXstreamProps<P, K extends keyof P, M extends K>(
  Comp: CClass<P>,
  ...names: Array<M>
): CClass<XstreamProps<P, K>> {
  const WXP: CClass<XstreamProps<P, K>> = class extends Component<
    XstreamProps<P, K>
  > {
    constructor(props: any) {
      super(props);
      const initialState: any = {};
      for (let n = names.length, i = 0; i < n; i++) {
        initialState[names[i]] = null;
      }
      this.state = initialState;
    }

    private _subs?: Record<M, Subscription>;

    public componentDidMount() {
      const props = this.props as XstreamProps<P, K>;
      this._subs = {} as Record<M, Subscription>;
      const that = this;
      names.forEach(name => {
        this._subs![name] = (props[name] as Stream<any>).subscribe({
          next(val: any) {
            that.setState((prev: any) => ({[name]: val}));
          },
        });
      });
    }

    public componentWillUnmount() {
      if (!this._subs) return;
      let name: M;
      for (let n = names.length, i = 0; i < n; i++) {
        name = names[i];
        if (this._subs[name]) {
          this._subs[name].unsubscribe();
        }
      }
      this._subs = void 0;
    }

    public render() {
      const props: P = {...(this.props as any), ...(this.state as any)};
      return createElement(Comp, props, this.props.children);
    }
  };
  WXP.displayName =
    'WithXstreamProps(' +
    (Comp.displayName || (Comp as any).name || 'Component') +
    ')';
  return WXP;
}
