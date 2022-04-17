import { markInjectable, getInjectableOpts } from '.';
import type { ConstructorOf } from './declare';

export type Domain = string | symbol;

/**
 * 修饰一个 Class 是某个特定的 DI 分组的装饰器
 * @param domains
 */
export function Domain(...domains: Domain[]) {
  return (target: ConstructorOf<any>) => {
    const opts = getInjectableOpts(target) || {};
    opts.domain = domains;
    markInjectable(target, opts);
  };
}

const domainMap = new Map<Domain, ConstructorOf<any>>();

/**
 * 带全局记录的 Domain 装饰器
 * @param domain
 */
export function EffectDomain(domain: Domain) {
  return (target: ConstructorOf<any>) => {
    const opts = getInjectableOpts(target) || {};
    opts.domain = domain;
    markInjectable(target, opts);

    const tmp = domainMap.get(domain);
    if (!tmp) {
      domainMap.set(domain, target);
    }
  };
}

export function getDomainConstructors(...domains: Domain[]) {
  const constructorSet = new Set<ConstructorOf<any>>();
  for (const domain of domains) {
    const constructor = domainMap.get(domain);
    if (constructor) {
      constructorSet.add(constructor);
    } else {
      console.error(`没有获取到 ${String(domain)} 对应的Constructor！`);
    }
  }
  return Array.from(constructorSet);
}