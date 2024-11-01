var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win2) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win2.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win2) => win2.CapacitorPlatforms = createCapacitorPlatforms(win2);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win2) => {
  var _a, _b;
  if (win2 === null || win2 === void 0 ? void 0 : win2.androidBridge) {
    return "android";
  } else if ((_b = (_a = win2 === null || win2 === void 0 ? void 0 : win2.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win2) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win2.CapacitorCustomPlatform || null;
  const cap = win2.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win2.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win2);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h2) => h2.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err2) => win2.console.error(err2);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove2;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove2 = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove2();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove2 = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve) => call.then(() => resolve({ remove: remove2 })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove2();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win2) => win2.Capacitor = createCapacitor(win2);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
Capacitor.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.retainedEventArguments = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    let firstListener = false;
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
      firstListener = true;
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    if (firstListener) {
      this.sendRetainedArgumentsForEvent(eventName);
    }
    const remove2 = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove: remove2 });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data, retainUntilConsumed) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      if (retainUntilConsumed) {
        let args = this.retainedEventArguments[eventName];
        if (!args) {
          args = [];
        }
        args.push(data);
        this.retainedEventArguments[eventName] = args;
      }
      return;
    }
    listeners.forEach((listener) => listener(data));
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index2 = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index2, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
  sendRetainedArgumentsForEvent(eventName) {
    const args = this.retainedEventArguments[eventName];
    if (!args) {
      return;
    }
    delete this.retainedEventArguments[eventName];
    args.forEach((arg) => {
      this.notifyListeners(eventName, arg);
    });
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error2) {
      return Promise.reject(error2);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error2) {
      return Promise.reject(error2);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error2) {
      return Promise.reject(error2);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error2) {
      return Promise.reject(error2);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error2) => reject(error2);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index2) => {
    acc[key] = headers[originalKeys[index2]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
const Preferences = registerPlugin("Preferences", {
  web: () => __vitePreload(() => import("./web.d71688cb.js"), true ? [] : void 0).then((m) => new m.PreferencesWeb())
});
async function storage_setItem(key, value) {
  await Preferences.set({
    key,
    value: typeof value == "object" ? JSON.stringify(value) : value
  });
}
async function storage_getItem(key) {
  const ret = await Preferences.get({ key });
  return typeof JSON.parse(ret.value) == "object" ? JSON.parse(ret.value) : ret.value;
}
async function storage_remove(key) {
  await Preferences.remove({ key });
}
async function storage_clear() {
  await Preferences.clear();
}
const DismissReason = Object.freeze({
  cancel: "cancel",
  backdrop: "backdrop",
  close: "close",
  esc: "esc",
  timer: "timer"
});
const consolePrefix = "SweetAlert2:";
const uniqueArray = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }
  return result;
};
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toArray = (nodeList) => Array.prototype.slice.call(nodeList);
const warn = (message) => {
  console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
};
const error = (message) => {
  console.error(`${consolePrefix} ${message}`);
};
const previousWarnOnceMessages = [];
const warnOnce = (message) => {
  if (!previousWarnOnceMessages.includes(message)) {
    previousWarnOnceMessages.push(message);
    warn(message);
  }
};
const warnAboutDeprecation = (deprecatedParam, useInstead) => {
  warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release. Please use "${useInstead}" instead.`);
};
const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
const isJqueryElement = (elem) => typeof elem === "object" && elem.jquery;
const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
const argsToParams = (args) => {
  const params = {};
  if (typeof args[0] === "object" && !isElement(args[0])) {
    Object.assign(params, args[0]);
  } else {
    ["title", "html", "icon"].forEach((name, index2) => {
      const arg = args[index2];
      if (typeof arg === "string" || isElement(arg)) {
        params[name] = arg;
      } else if (arg !== void 0) {
        error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
      }
    });
  }
  return params;
};
const swalPrefix = "swal2-";
const prefix = (items) => {
  const result = {};
  for (const i in items) {
    result[items[i]] = swalPrefix + items[i];
  }
  return result;
};
const swalClasses = prefix([
  "container",
  "shown",
  "height-auto",
  "iosfix",
  "popup",
  "modal",
  "no-backdrop",
  "no-transition",
  "toast",
  "toast-shown",
  "show",
  "hide",
  "close",
  "title",
  "html-container",
  "actions",
  "confirm",
  "deny",
  "cancel",
  "default-outline",
  "footer",
  "icon",
  "icon-content",
  "image",
  "input",
  "file",
  "range",
  "select",
  "radio",
  "checkbox",
  "label",
  "textarea",
  "inputerror",
  "input-label",
  "validation-message",
  "progress-steps",
  "active-progress-step",
  "progress-step",
  "progress-step-line",
  "loader",
  "loading",
  "styled",
  "top",
  "top-start",
  "top-end",
  "top-left",
  "top-right",
  "center",
  "center-start",
  "center-end",
  "center-left",
  "center-right",
  "bottom",
  "bottom-start",
  "bottom-end",
  "bottom-left",
  "bottom-right",
  "grow-row",
  "grow-column",
  "grow-fullscreen",
  "rtl",
  "timer-progress-bar",
  "timer-progress-bar-container",
  "scrollbar-measure",
  "icon-success",
  "icon-warning",
  "icon-info",
  "icon-question",
  "icon-error"
]);
const iconTypes = prefix([
  "success",
  "warning",
  "info",
  "question",
  "error"
]);
const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
const elementBySelector = (selectorString) => {
  const container = getContainer();
  return container ? container.querySelector(selectorString) : null;
};
const elementByClass = (className) => {
  return elementBySelector(`.${className}`);
};
const getPopup = () => elementByClass(swalClasses.popup);
const getIcon = () => elementByClass(swalClasses.icon);
const getTitle = () => elementByClass(swalClasses.title);
const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
const getImage = () => elementByClass(swalClasses.image);
const getProgressSteps$1 = () => elementByClass(swalClasses["progress-steps"]);
const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
const getConfirmButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`);
const getDenyButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`);
const getInputLabel = () => elementByClass(swalClasses["input-label"]);
const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
const getCancelButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`);
const getActions = () => elementByClass(swalClasses.actions);
const getFooter = () => elementByClass(swalClasses.footer);
const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
const getCloseButton = () => elementByClass(swalClasses.close);
const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
const getFocusableElements = () => {
  const focusableElementsWithTabindex = toArray(
    getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')
  ).sort((a, b) => {
    a = parseInt(a.getAttribute("tabindex"));
    b = parseInt(b.getAttribute("tabindex"));
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  });
  const otherFocusableElements = toArray(
    getPopup().querySelectorAll(focusable)
  ).filter((el) => el.getAttribute("tabindex") !== "-1");
  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter((el) => isVisible$1(el));
};
const isModal = () => {
  return !isToast() && !document.body.classList.contains(swalClasses["no-backdrop"]);
};
const isToast = () => {
  return document.body.classList.contains(swalClasses["toast-shown"]);
};
const isLoading = () => {
  return getPopup().hasAttribute("data-loading");
};
const states = {
  previousBodyPadding: null
};
const setInnerHtml = (elem, html) => {
  elem.textContent = "";
  if (html) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, `text/html`);
    toArray(parsed.querySelector("head").childNodes).forEach((child) => {
      elem.appendChild(child);
    });
    toArray(parsed.querySelector("body").childNodes).forEach((child) => {
      elem.appendChild(child);
    });
  }
};
const hasClass = (elem, className) => {
  if (!className) {
    return false;
  }
  const classList = className.split(/\s+/);
  for (let i = 0; i < classList.length; i++) {
    if (!elem.classList.contains(classList[i])) {
      return false;
    }
  }
  return true;
};
const removeCustomClasses = (elem, params) => {
  toArray(elem.classList).forEach((className) => {
    if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
      elem.classList.remove(className);
    }
  });
};
const applyCustomClass = (elem, params, className) => {
  removeCustomClasses(elem, params);
  if (params.customClass && params.customClass[className]) {
    if (typeof params.customClass[className] !== "string" && !params.customClass[className].forEach) {
      return warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof params.customClass[className]}"`);
    }
    addClass(elem, params.customClass[className]);
  }
};
const getInput$1 = (popup, inputType) => {
  if (!inputType) {
    return null;
  }
  switch (inputType) {
    case "select":
    case "textarea":
    case "file":
      return getChildByClass(popup, swalClasses[inputType]);
    case "checkbox":
      return popup.querySelector(`.${swalClasses.checkbox} input`);
    case "radio":
      return popup.querySelector(`.${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.radio} input:first-child`);
    case "range":
      return popup.querySelector(`.${swalClasses.range} input`);
    default:
      return getChildByClass(popup, swalClasses.input);
  }
};
const focusInput = (input) => {
  input.focus();
  if (input.type !== "file") {
    const val = input.value;
    input.value = "";
    input.value = val;
  }
};
const toggleClass$1 = (target, classList, condition) => {
  if (!target || !classList) {
    return;
  }
  if (typeof classList === "string") {
    classList = classList.split(/\s+/).filter(Boolean);
  }
  classList.forEach((className) => {
    if (target.forEach) {
      target.forEach((elem) => {
        condition ? elem.classList.add(className) : elem.classList.remove(className);
      });
    } else {
      condition ? target.classList.add(className) : target.classList.remove(className);
    }
  });
};
const addClass = (target, classList) => {
  toggleClass$1(target, classList, true);
};
const removeClass = (target, classList) => {
  toggleClass$1(target, classList, false);
};
const getChildByClass = (elem, className) => {
  for (let i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};
const applyNumericalStyle = (elem, property, value) => {
  if (value === `${parseInt(value)}`) {
    value = parseInt(value);
  }
  if (value || parseInt(value) === 0) {
    elem.style[property] = typeof value === "number" ? `${value}px` : value;
  } else {
    elem.style.removeProperty(property);
  }
};
const show = (elem, display = "flex") => {
  elem.style.display = display;
};
const hide = (elem) => {
  elem.style.display = "none";
};
const setStyle = (parent, selector, property, value) => {
  const el = parent.querySelector(selector);
  if (el) {
    el.style[property] = value;
  }
};
const toggle = (elem, condition, display) => {
  condition ? show(elem, display) : hide(elem);
};
const isVisible$1 = (elem) => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
const isScrollable = (elem) => !!(elem.scrollHeight > elem.clientHeight);
const hasCssAnimation = (elem) => {
  const style2 = window.getComputedStyle(elem);
  const animDuration = parseFloat(style2.getPropertyValue("animation-duration") || "0");
  const transDuration = parseFloat(style2.getPropertyValue("transition-duration") || "0");
  return animDuration > 0 || transDuration > 0;
};
const animateTimerProgressBar = (timer, reset = false) => {
  const timerProgressBar = getTimerProgressBar();
  if (isVisible$1(timerProgressBar)) {
    if (reset) {
      timerProgressBar.style.transition = "none";
      timerProgressBar.style.width = "100%";
    }
    setTimeout(() => {
      timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
      timerProgressBar.style.width = "0%";
    }, 10);
  }
};
const stopTimerProgressBar = () => {
  const timerProgressBar = getTimerProgressBar();
  const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
  timerProgressBar.style.removeProperty("transition");
  timerProgressBar.style.width = "100%";
  const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
  const timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
  timerProgressBar.style.removeProperty("transition");
  timerProgressBar.style.width = `${timerProgressBarPercent}%`;
};
const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
     <input type="checkbox" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
const resetOldContainer = () => {
  const oldContainer = getContainer();
  if (!oldContainer) {
    return false;
  }
  oldContainer.remove();
  removeClass(
    [document.documentElement, document.body],
    [
      swalClasses["no-backdrop"],
      swalClasses["toast-shown"],
      swalClasses["has-column"]
    ]
  );
  return true;
};
const resetValidationMessage$1 = () => {
  if (Swal.isVisible()) {
    Swal.resetValidationMessage();
  }
};
const addInputChangeListeners = () => {
  const popup = getPopup();
  const input = getChildByClass(popup, swalClasses.input);
  const file = getChildByClass(popup, swalClasses.file);
  const range = popup.querySelector(`.${swalClasses.range} input`);
  const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
  const select = getChildByClass(popup, swalClasses.select);
  const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
  const textarea = getChildByClass(popup, swalClasses.textarea);
  input.oninput = resetValidationMessage$1;
  file.onchange = resetValidationMessage$1;
  select.onchange = resetValidationMessage$1;
  checkbox.onchange = resetValidationMessage$1;
  textarea.oninput = resetValidationMessage$1;
  range.oninput = () => {
    resetValidationMessage$1();
    rangeOutput.value = range.value;
  };
  range.onchange = () => {
    resetValidationMessage$1();
    range.nextSibling.value = range.value;
  };
};
const getTarget = (target) => typeof target === "string" ? document.querySelector(target) : target;
const setupAccessibility = (params) => {
  const popup = getPopup();
  popup.setAttribute("role", params.toast ? "alert" : "dialog");
  popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
  if (!params.toast) {
    popup.setAttribute("aria-modal", "true");
  }
};
const setupRTL = (targetElement) => {
  if (window.getComputedStyle(targetElement).direction === "rtl") {
    addClass(getContainer(), swalClasses.rtl);
  }
};
const init = (params) => {
  const oldContainerExisted = resetOldContainer();
  if (isNodeEnv()) {
    error("SweetAlert2 requires document to initialize");
    return;
  }
  const container = document.createElement("div");
  container.className = swalClasses.container;
  if (oldContainerExisted) {
    addClass(container, swalClasses["no-transition"]);
  }
  setInnerHtml(container, sweetHTML);
  const targetElement = getTarget(params.target);
  targetElement.appendChild(container);
  setupAccessibility(params);
  setupRTL(targetElement);
  addInputChangeListeners();
};
const parseHtmlToContainer = (param, target) => {
  if (param instanceof HTMLElement) {
    target.appendChild(param);
  } else if (typeof param === "object") {
    handleObject(param, target);
  } else if (param) {
    setInnerHtml(target, param);
  }
};
const handleObject = (param, target) => {
  if (param.jquery) {
    handleJqueryElem(target, param);
  } else {
    setInnerHtml(target, param.toString());
  }
};
const handleJqueryElem = (target, elem) => {
  target.textContent = "";
  if (0 in elem) {
    for (let i = 0; i in elem; i++) {
      target.appendChild(elem[i].cloneNode(true));
    }
  } else {
    target.appendChild(elem.cloneNode(true));
  }
};
const animationEndEvent = (() => {
  if (isNodeEnv()) {
    return false;
  }
  const testEl = document.createElement("div");
  const transEndEventNames = {
    WebkitAnimation: "webkitAnimationEnd",
    OAnimation: "oAnimationEnd oanimationend",
    animation: "animationend"
  };
  for (const i in transEndEventNames) {
    if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== "undefined") {
      return transEndEventNames[i];
    }
  }
  return false;
})();
const measureScrollbar = () => {
  const scrollDiv = document.createElement("div");
  scrollDiv.className = swalClasses["scrollbar-measure"];
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};
const renderActions = (instance, params) => {
  const actions = getActions();
  const loader = getLoader();
  const confirmButton = getConfirmButton();
  const denyButton = getDenyButton();
  const cancelButton = getCancelButton();
  if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
    hide(actions);
  }
  applyCustomClass(actions, params, "actions");
  renderButton(confirmButton, "confirm", params);
  renderButton(denyButton, "deny", params);
  renderButton(cancelButton, "cancel", params);
  handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
  if (params.reverseButtons) {
    actions.insertBefore(cancelButton, loader);
    actions.insertBefore(denyButton, loader);
    actions.insertBefore(confirmButton, loader);
  }
  setInnerHtml(loader, params.loaderHtml);
  applyCustomClass(loader, params, "loader");
};
function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
  if (!params.buttonsStyling) {
    return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
  }
  addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
  if (params.confirmButtonColor) {
    confirmButton.style.backgroundColor = params.confirmButtonColor;
    addClass(confirmButton, swalClasses["default-outline"]);
  }
  if (params.denyButtonColor) {
    denyButton.style.backgroundColor = params.denyButtonColor;
    addClass(denyButton, swalClasses["default-outline"]);
  }
  if (params.cancelButtonColor) {
    cancelButton.style.backgroundColor = params.cancelButtonColor;
    addClass(cancelButton, swalClasses["default-outline"]);
  }
}
function renderButton(button, buttonType, params) {
  toggle(button, params[`show${capitalizeFirstLetter(buttonType)}Button`], "inline-block");
  setInnerHtml(button, params[`${buttonType}ButtonText`]);
  button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`]);
  button.className = swalClasses[buttonType];
  applyCustomClass(button, params, `${buttonType}Button`);
  addClass(button, params[`${buttonType}ButtonClass`]);
}
function handleBackdropParam(container, backdrop) {
  if (typeof backdrop === "string") {
    container.style.background = backdrop;
  } else if (!backdrop) {
    addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
  }
}
function handlePositionParam(container, position) {
  if (position in swalClasses) {
    addClass(container, swalClasses[position]);
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"');
    addClass(container, swalClasses.center);
  }
}
function handleGrowParam(container, grow) {
  if (grow && typeof grow === "string") {
    const growClass = `grow-${grow}`;
    if (growClass in swalClasses) {
      addClass(container, swalClasses[growClass]);
    }
  }
}
const renderContainer = (instance, params) => {
  const container = getContainer();
  if (!container) {
    return;
  }
  handleBackdropParam(container, params.backdrop);
  handlePositionParam(container, params.position);
  handleGrowParam(container, params.grow);
  applyCustomClass(container, params, "container");
};
var privateProps = {
  promise: /* @__PURE__ */ new WeakMap(),
  innerParams: /* @__PURE__ */ new WeakMap(),
  domCache: /* @__PURE__ */ new WeakMap()
};
const inputTypes = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
const renderInput = (instance, params) => {
  const popup = getPopup();
  const innerParams = privateProps.innerParams.get(instance);
  const rerender = !innerParams || params.input !== innerParams.input;
  inputTypes.forEach((inputType) => {
    const inputClass = swalClasses[inputType];
    const inputContainer = getChildByClass(popup, inputClass);
    setAttributes(inputType, params.inputAttributes);
    inputContainer.className = inputClass;
    if (rerender) {
      hide(inputContainer);
    }
  });
  if (params.input) {
    if (rerender) {
      showInput(params);
    }
    setCustomClass(params);
  }
};
const showInput = (params) => {
  if (!renderInputType[params.input]) {
    return error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`);
  }
  const inputContainer = getInputContainer(params.input);
  const input = renderInputType[params.input](inputContainer, params);
  show(input);
  setTimeout(() => {
    focusInput(input);
  });
};
const removeAttributes = (input) => {
  for (let i = 0; i < input.attributes.length; i++) {
    const attrName = input.attributes[i].name;
    if (!["type", "value", "style"].includes(attrName)) {
      input.removeAttribute(attrName);
    }
  }
};
const setAttributes = (inputType, inputAttributes) => {
  const input = getInput$1(getPopup(), inputType);
  if (!input) {
    return;
  }
  removeAttributes(input);
  for (const attr in inputAttributes) {
    input.setAttribute(attr, inputAttributes[attr]);
  }
};
const setCustomClass = (params) => {
  const inputContainer = getInputContainer(params.input);
  if (params.customClass) {
    addClass(inputContainer, params.customClass.input);
  }
};
const setInputPlaceholder = (input, params) => {
  if (!input.placeholder || params.inputPlaceholder) {
    input.placeholder = params.inputPlaceholder;
  }
};
const setInputLabel = (input, prependTo, params) => {
  if (params.inputLabel) {
    input.id = swalClasses.input;
    const label = document.createElement("label");
    const labelClass = swalClasses["input-label"];
    label.setAttribute("for", input.id);
    label.className = labelClass;
    addClass(label, params.customClass.inputLabel);
    label.innerText = params.inputLabel;
    prependTo.insertAdjacentElement("beforebegin", label);
  }
};
const getInputContainer = (inputType) => {
  const inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
  return getChildByClass(getPopup(), inputClass);
};
const renderInputType = {};
renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
  if (typeof params.inputValue === "string" || typeof params.inputValue === "number") {
    input.value = params.inputValue;
  } else if (!isPromise(params.inputValue)) {
    warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof params.inputValue}"`);
  }
  setInputLabel(input, input, params);
  setInputPlaceholder(input, params);
  input.type = params.input;
  return input;
};
renderInputType.file = (input, params) => {
  setInputLabel(input, input, params);
  setInputPlaceholder(input, params);
  return input;
};
renderInputType.range = (range, params) => {
  const rangeInput = range.querySelector("input");
  const rangeOutput = range.querySelector("output");
  rangeInput.value = params.inputValue;
  rangeInput.type = params.input;
  rangeOutput.value = params.inputValue;
  setInputLabel(rangeInput, range, params);
  return range;
};
renderInputType.select = (select, params) => {
  select.textContent = "";
  if (params.inputPlaceholder) {
    const placeholder = document.createElement("option");
    setInnerHtml(placeholder, params.inputPlaceholder);
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
  }
  setInputLabel(select, select, params);
  return select;
};
renderInputType.radio = (radio) => {
  radio.textContent = "";
  return radio;
};
renderInputType.checkbox = (checkboxContainer, params) => {
  const checkbox = getInput$1(getPopup(), "checkbox");
  checkbox.value = 1;
  checkbox.id = swalClasses.checkbox;
  checkbox.checked = Boolean(params.inputValue);
  const label = checkboxContainer.querySelector("span");
  setInnerHtml(label, params.inputPlaceholder);
  return checkboxContainer;
};
renderInputType.textarea = (textarea, params) => {
  textarea.value = params.inputValue;
  setInputPlaceholder(textarea, params);
  setInputLabel(textarea, textarea, params);
  const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
  if ("MutationObserver" in window) {
    const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
    const outputsize = () => {
      const textareaWidth = textarea.offsetWidth + getMargin(textarea);
      if (textareaWidth > initialPopupWidth) {
        getPopup().style.width = `${textareaWidth}px`;
      } else {
        getPopup().style.width = null;
      }
    };
    new MutationObserver(outputsize).observe(textarea, {
      attributes: true,
      attributeFilter: ["style"]
    });
  }
  return textarea;
};
const renderContent = (instance, params) => {
  const htmlContainer = getHtmlContainer();
  applyCustomClass(htmlContainer, params, "htmlContainer");
  if (params.html) {
    parseHtmlToContainer(params.html, htmlContainer);
    show(htmlContainer, "block");
  } else if (params.text) {
    htmlContainer.textContent = params.text;
    show(htmlContainer, "block");
  } else {
    hide(htmlContainer);
  }
  renderInput(instance, params);
};
const renderFooter = (instance, params) => {
  const footer = getFooter();
  toggle(footer, params.footer);
  if (params.footer) {
    parseHtmlToContainer(params.footer, footer);
  }
  applyCustomClass(footer, params, "footer");
};
const renderCloseButton = (instance, params) => {
  const closeButton = getCloseButton();
  setInnerHtml(closeButton, params.closeButtonHtml);
  applyCustomClass(closeButton, params, "closeButton");
  toggle(closeButton, params.showCloseButton);
  closeButton.setAttribute("aria-label", params.closeButtonAriaLabel);
};
const renderIcon = (instance, params) => {
  const innerParams = privateProps.innerParams.get(instance);
  const icon = getIcon();
  if (innerParams && params.icon === innerParams.icon) {
    setContent(icon, params);
    applyStyles(icon, params);
    return;
  }
  if (!params.icon && !params.iconHtml) {
    return hide(icon);
  }
  if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
    error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
    return hide(icon);
  }
  show(icon);
  setContent(icon, params);
  applyStyles(icon, params);
  addClass(icon, params.showClass.icon);
};
const applyStyles = (icon, params) => {
  for (const iconType in iconTypes) {
    if (params.icon !== iconType) {
      removeClass(icon, iconTypes[iconType]);
    }
  }
  addClass(icon, iconTypes[params.icon]);
  setColor(icon, params);
  adjustSuccessIconBackgoundColor();
  applyCustomClass(icon, params, "icon");
};
const adjustSuccessIconBackgoundColor = () => {
  const popup = getPopup();
  const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
  const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
  for (let i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor;
  }
};
const setContent = (icon, params) => {
  icon.textContent = "";
  if (params.iconHtml) {
    setInnerHtml(icon, iconContent(params.iconHtml));
  } else if (params.icon === "success") {
    setInnerHtml(icon, `
      <div class="swal2-success-circular-line-left"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
      <div class="swal2-success-circular-line-right"></div>
    `);
  } else if (params.icon === "error") {
    setInnerHtml(icon, `
      <span class="swal2-x-mark">
        <span class="swal2-x-mark-line-left"></span>
        <span class="swal2-x-mark-line-right"></span>
      </span>
    `);
  } else {
    const defaultIconHtml = {
      question: "?",
      warning: "!",
      info: "i"
    };
    setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
  }
};
const setColor = (icon, params) => {
  if (!params.iconColor) {
    return;
  }
  icon.style.color = params.iconColor;
  icon.style.borderColor = params.iconColor;
  for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
    setStyle(icon, sel, "backgroundColor", params.iconColor);
  }
  setStyle(icon, ".swal2-success-ring", "borderColor", params.iconColor);
};
const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
const renderImage = (instance, params) => {
  const image = getImage();
  if (!params.imageUrl) {
    return hide(image);
  }
  show(image, "");
  image.setAttribute("src", params.imageUrl);
  image.setAttribute("alt", params.imageAlt);
  applyNumericalStyle(image, "width", params.imageWidth);
  applyNumericalStyle(image, "height", params.imageHeight);
  image.className = swalClasses.image;
  applyCustomClass(image, params, "image");
};
const createStepElement = (step) => {
  const stepEl = document.createElement("li");
  addClass(stepEl, swalClasses["progress-step"]);
  setInnerHtml(stepEl, step);
  return stepEl;
};
const createLineElement = (params) => {
  const lineEl = document.createElement("li");
  addClass(lineEl, swalClasses["progress-step-line"]);
  if (params.progressStepsDistance) {
    lineEl.style.width = params.progressStepsDistance;
  }
  return lineEl;
};
const renderProgressSteps = (instance, params) => {
  const progressStepsContainer = getProgressSteps$1();
  if (!params.progressSteps || params.progressSteps.length === 0) {
    return hide(progressStepsContainer);
  }
  show(progressStepsContainer);
  progressStepsContainer.textContent = "";
  if (params.currentProgressStep >= params.progressSteps.length) {
    warn(
      "Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"
    );
  }
  params.progressSteps.forEach((step, index2) => {
    const stepEl = createStepElement(step);
    progressStepsContainer.appendChild(stepEl);
    if (index2 === params.currentProgressStep) {
      addClass(stepEl, swalClasses["active-progress-step"]);
    }
    if (index2 !== params.progressSteps.length - 1) {
      const lineEl = createLineElement(params);
      progressStepsContainer.appendChild(lineEl);
    }
  });
};
const renderTitle = (instance, params) => {
  const title = getTitle();
  toggle(title, params.title || params.titleText, "block");
  if (params.title) {
    parseHtmlToContainer(params.title, title);
  }
  if (params.titleText) {
    title.innerText = params.titleText;
  }
  applyCustomClass(title, params, "title");
};
const renderPopup = (instance, params) => {
  const container = getContainer();
  const popup = getPopup();
  if (params.toast) {
    applyNumericalStyle(container, "width", params.width);
    popup.style.width = "100%";
    popup.insertBefore(getLoader(), getIcon());
  } else {
    applyNumericalStyle(popup, "width", params.width);
  }
  applyNumericalStyle(popup, "padding", params.padding);
  if (params.background) {
    popup.style.background = params.background;
  }
  hide(getValidationMessage());
  addClasses$1(popup, params);
};
const addClasses$1 = (popup, params) => {
  popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? params.showClass.popup : ""}`;
  if (params.toast) {
    addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
    addClass(popup, swalClasses.toast);
  } else {
    addClass(popup, swalClasses.modal);
  }
  applyCustomClass(popup, params, "popup");
  if (typeof params.customClass === "string") {
    addClass(popup, params.customClass);
  }
  if (params.icon) {
    addClass(popup, swalClasses[`icon-${params.icon}`]);
  }
};
const render = (instance, params) => {
  renderPopup(instance, params);
  renderContainer(instance, params);
  renderProgressSteps(instance, params);
  renderIcon(instance, params);
  renderImage(instance, params);
  renderTitle(instance, params);
  renderCloseButton(instance, params);
  renderContent(instance, params);
  renderActions(instance, params);
  renderFooter(instance, params);
  if (typeof params.didRender === "function") {
    params.didRender(getPopup());
  }
};
const isVisible = () => {
  return isVisible$1(getPopup());
};
const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
const clickDeny = () => getDenyButton() && getDenyButton().click();
const clickCancel = () => getCancelButton() && getCancelButton().click();
function fire(...args) {
  const Swal2 = this;
  return new Swal2(...args);
}
function mixin(mixinParams) {
  class MixinSwal extends this {
    _main(params, priorityMixinParams) {
      return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
    }
  }
  return MixinSwal;
}
const showLoading = (buttonToReplace) => {
  let popup = getPopup();
  if (!popup) {
    Swal.fire();
  }
  popup = getPopup();
  const loader = getLoader();
  if (isToast()) {
    hide(getIcon());
  } else {
    replaceButton(popup, buttonToReplace);
  }
  show(loader);
  popup.setAttribute("data-loading", true);
  popup.setAttribute("aria-busy", true);
  popup.focus();
};
const replaceButton = (popup, buttonToReplace) => {
  const actions = getActions();
  const loader = getLoader();
  if (!buttonToReplace && isVisible$1(getConfirmButton())) {
    buttonToReplace = getConfirmButton();
  }
  show(actions);
  if (buttonToReplace) {
    hide(buttonToReplace);
    loader.setAttribute("data-button-to-replace", buttonToReplace.className);
  }
  loader.parentNode.insertBefore(loader, buttonToReplace);
  addClass([popup, actions], swalClasses.loading);
};
const RESTORE_FOCUS_TIMEOUT = 100;
const globalState = {};
const focusPreviousActiveElement = () => {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    globalState.previousActiveElement.focus();
    globalState.previousActiveElement = null;
  } else if (document.body) {
    document.body.focus();
  }
};
const restoreActiveElement = (returnFocus) => {
  return new Promise((resolve) => {
    if (!returnFocus) {
      return resolve();
    }
    const x = window.scrollX;
    const y = window.scrollY;
    globalState.restoreFocusTimeout = setTimeout(() => {
      focusPreviousActiveElement();
      resolve();
    }, RESTORE_FOCUS_TIMEOUT);
    window.scrollTo(x, y);
  });
};
const getTimerLeft = () => {
  return globalState.timeout && globalState.timeout.getTimerLeft();
};
const stopTimer = () => {
  if (globalState.timeout) {
    stopTimerProgressBar();
    return globalState.timeout.stop();
  }
};
const resumeTimer = () => {
  if (globalState.timeout) {
    const remaining = globalState.timeout.start();
    animateTimerProgressBar(remaining);
    return remaining;
  }
};
const toggleTimer = () => {
  const timer = globalState.timeout;
  return timer && (timer.running ? stopTimer() : resumeTimer());
};
const increaseTimer = (n) => {
  if (globalState.timeout) {
    const remaining = globalState.timeout.increase(n);
    animateTimerProgressBar(remaining, true);
    return remaining;
  }
};
const isTimerRunning = () => {
  return globalState.timeout && globalState.timeout.isRunning();
};
let bodyClickListenerAdded = false;
const clickHandlers = {};
function bindClickHandler(attr = "data-swal-template") {
  clickHandlers[attr] = this;
  if (!bodyClickListenerAdded) {
    document.body.addEventListener("click", bodyClickListener);
    bodyClickListenerAdded = true;
  }
}
const bodyClickListener = (event) => {
  for (let el = event.target; el && el !== document; el = el.parentNode) {
    for (const attr in clickHandlers) {
      const template = el.getAttribute(attr);
      if (template) {
        clickHandlers[attr].fire({ template });
        return;
      }
    }
  }
};
const defaultParams = {
  title: "",
  titleText: "",
  text: "",
  html: "",
  footer: "",
  icon: void 0,
  iconColor: void 0,
  iconHtml: void 0,
  template: void 0,
  toast: false,
  showClass: {
    popup: "swal2-show",
    backdrop: "swal2-backdrop-show",
    icon: "swal2-icon-show"
  },
  hideClass: {
    popup: "swal2-hide",
    backdrop: "swal2-backdrop-hide",
    icon: "swal2-icon-hide"
  },
  customClass: {},
  target: "body",
  backdrop: true,
  heightAuto: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  showConfirmButton: true,
  showDenyButton: false,
  showCancelButton: false,
  preConfirm: void 0,
  preDeny: void 0,
  confirmButtonText: "OK",
  confirmButtonAriaLabel: "",
  confirmButtonColor: void 0,
  denyButtonText: "No",
  denyButtonAriaLabel: "",
  denyButtonColor: void 0,
  cancelButtonText: "Cancel",
  cancelButtonAriaLabel: "",
  cancelButtonColor: void 0,
  buttonsStyling: true,
  reverseButtons: false,
  focusConfirm: true,
  focusDeny: false,
  focusCancel: false,
  returnFocus: true,
  showCloseButton: false,
  closeButtonHtml: "&times;",
  closeButtonAriaLabel: "Close this dialog",
  loaderHtml: "",
  showLoaderOnConfirm: false,
  showLoaderOnDeny: false,
  imageUrl: void 0,
  imageWidth: void 0,
  imageHeight: void 0,
  imageAlt: "",
  timer: void 0,
  timerProgressBar: false,
  width: void 0,
  padding: void 0,
  background: void 0,
  input: void 0,
  inputPlaceholder: "",
  inputLabel: "",
  inputValue: "",
  inputOptions: {},
  inputAutoTrim: true,
  inputAttributes: {},
  inputValidator: void 0,
  returnInputValueOnDeny: false,
  validationMessage: void 0,
  grow: false,
  position: "center",
  progressSteps: [],
  currentProgressStep: void 0,
  progressStepsDistance: void 0,
  willOpen: void 0,
  didOpen: void 0,
  didRender: void 0,
  willClose: void 0,
  didClose: void 0,
  didDestroy: void 0,
  scrollbarPadding: true
};
const updatableParams = [
  "allowEscapeKey",
  "allowOutsideClick",
  "background",
  "buttonsStyling",
  "cancelButtonAriaLabel",
  "cancelButtonColor",
  "cancelButtonText",
  "closeButtonAriaLabel",
  "closeButtonHtml",
  "confirmButtonAriaLabel",
  "confirmButtonColor",
  "confirmButtonText",
  "currentProgressStep",
  "customClass",
  "denyButtonAriaLabel",
  "denyButtonColor",
  "denyButtonText",
  "didClose",
  "didDestroy",
  "footer",
  "hideClass",
  "html",
  "icon",
  "iconColor",
  "iconHtml",
  "imageAlt",
  "imageHeight",
  "imageUrl",
  "imageWidth",
  "progressSteps",
  "returnFocus",
  "reverseButtons",
  "showCancelButton",
  "showCloseButton",
  "showConfirmButton",
  "showDenyButton",
  "text",
  "title",
  "titleText",
  "willClose"
];
const deprecatedParams = {};
const toastIncompatibleParams = [
  "allowOutsideClick",
  "allowEnterKey",
  "backdrop",
  "focusConfirm",
  "focusDeny",
  "focusCancel",
  "returnFocus",
  "heightAuto",
  "keydownListenerCapture"
];
const isValidParameter = (paramName) => {
  return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
};
const isUpdatableParameter = (paramName) => {
  return updatableParams.indexOf(paramName) !== -1;
};
const isDeprecatedParameter = (paramName) => {
  return deprecatedParams[paramName];
};
const checkIfParamIsValid = (param) => {
  if (!isValidParameter(param)) {
    warn(`Unknown parameter "${param}"`);
  }
};
const checkIfToastParamIsValid = (param) => {
  if (toastIncompatibleParams.includes(param)) {
    warn(`The parameter "${param}" is incompatible with toasts`);
  }
};
const checkIfParamIsDeprecated = (param) => {
  if (isDeprecatedParameter(param)) {
    warnAboutDeprecation(param, isDeprecatedParameter(param));
  }
};
const showWarningsForParams = (params) => {
  if (!params.backdrop && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
  }
  for (const param in params) {
    checkIfParamIsValid(param);
    if (params.toast) {
      checkIfToastParamIsValid(param);
    }
    checkIfParamIsDeprecated(param);
  }
};
var staticMethods = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isValidParameter,
  isUpdatableParameter,
  isDeprecatedParameter,
  argsToParams,
  getContainer,
  getPopup,
  getTitle,
  getHtmlContainer,
  getImage,
  getIcon,
  getInputLabel,
  getCloseButton,
  getActions,
  getConfirmButton,
  getDenyButton,
  getCancelButton,
  getLoader,
  getFooter,
  getTimerProgressBar,
  getFocusableElements,
  getValidationMessage,
  isLoading,
  isVisible,
  clickConfirm,
  clickDeny,
  clickCancel,
  fire,
  mixin,
  showLoading,
  enableLoading: showLoading,
  getTimerLeft,
  stopTimer,
  resumeTimer,
  toggleTimer,
  increaseTimer,
  isTimerRunning,
  bindClickHandler
}, Symbol.toStringTag, { value: "Module" }));
function hideLoading() {
  const innerParams = privateProps.innerParams.get(this);
  if (!innerParams) {
    return;
  }
  const domCache = privateProps.domCache.get(this);
  hide(domCache.loader);
  if (isToast()) {
    if (innerParams.icon) {
      show(getIcon());
    }
  } else {
    showRelatedButton(domCache);
  }
  removeClass([domCache.popup, domCache.actions], swalClasses.loading);
  domCache.popup.removeAttribute("aria-busy");
  domCache.popup.removeAttribute("data-loading");
  domCache.confirmButton.disabled = false;
  domCache.denyButton.disabled = false;
  domCache.cancelButton.disabled = false;
}
const showRelatedButton = (domCache) => {
  const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
  if (buttonToReplace.length) {
    show(buttonToReplace[0], "inline-block");
  } else if (allButtonsAreHidden()) {
    hide(domCache.actions);
  }
};
function getInput(instance) {
  const innerParams = privateProps.innerParams.get(instance || this);
  const domCache = privateProps.domCache.get(instance || this);
  if (!domCache) {
    return null;
  }
  return getInput$1(domCache.popup, innerParams.input);
}
const fixScrollbar = () => {
  if (states.previousBodyPadding !== null) {
    return;
  }
  if (document.body.scrollHeight > window.innerHeight) {
    states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
    document.body.style.paddingRight = `${states.previousBodyPadding + measureScrollbar()}px`;
  }
};
const undoScrollbar = () => {
  if (states.previousBodyPadding !== null) {
    document.body.style.paddingRight = `${states.previousBodyPadding}px`;
    states.previousBodyPadding = null;
  }
};
const iOSfix = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
    const offset = document.body.scrollTop;
    document.body.style.top = `${offset * -1}px`;
    addClass(document.body, swalClasses.iosfix);
    lockBodyScroll();
    addBottomPaddingForTallPopups();
  }
};
const addBottomPaddingForTallPopups = () => {
  const safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);
  if (safari) {
    const bottomPanelHeight = 44;
    if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
      getContainer().style.paddingBottom = `${bottomPanelHeight}px`;
    }
  }
};
const lockBodyScroll = () => {
  const container = getContainer();
  let preventTouchMove;
  container.ontouchstart = (e) => {
    preventTouchMove = shouldPreventTouchMove(e);
  };
  container.ontouchmove = (e) => {
    if (preventTouchMove) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
};
const shouldPreventTouchMove = (event) => {
  const target = event.target;
  const container = getContainer();
  if (isStylys(event) || isZoom(event)) {
    return false;
  }
  if (target === container) {
    return true;
  }
  if (!isScrollable(container) && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !(isScrollable(getHtmlContainer()) && getHtmlContainer().contains(target))) {
    return true;
  }
  return false;
};
const isStylys = (event) => {
  return event.touches && event.touches.length && event.touches[0].touchType === "stylus";
};
const isZoom = (event) => {
  return event.touches && event.touches.length > 1;
};
const undoIOSfix = () => {
  if (hasClass(document.body, swalClasses.iosfix)) {
    const offset = parseInt(document.body.style.top, 10);
    removeClass(document.body, swalClasses.iosfix);
    document.body.style.top = "";
    document.body.scrollTop = offset * -1;
  }
};
const setAriaHidden = () => {
  const bodyChildren = toArray(document.body.children);
  bodyChildren.forEach((el) => {
    if (el === getContainer() || el.contains(getContainer())) {
      return;
    }
    if (el.hasAttribute("aria-hidden")) {
      el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden"));
    }
    el.setAttribute("aria-hidden", "true");
  });
};
const unsetAriaHidden = () => {
  const bodyChildren = toArray(document.body.children);
  bodyChildren.forEach((el) => {
    if (el.hasAttribute("data-previous-aria-hidden")) {
      el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden"));
      el.removeAttribute("data-previous-aria-hidden");
    } else {
      el.removeAttribute("aria-hidden");
    }
  });
};
var privateMethods = {
  swalPromiseResolve: /* @__PURE__ */ new WeakMap()
};
function removePopupAndResetState(instance, container, returnFocus, didClose) {
  if (isToast()) {
    triggerDidCloseAndDispose(instance, didClose);
  } else {
    restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
    globalState.keydownTarget.removeEventListener("keydown", globalState.keydownHandler, { capture: globalState.keydownListenerCapture });
    globalState.keydownHandlerAdded = false;
  }
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    container.setAttribute("style", "display:none !important");
    container.removeAttribute("class");
    container.innerHTML = "";
  } else {
    container.remove();
  }
  if (isModal()) {
    undoScrollbar();
    undoIOSfix();
    unsetAriaHidden();
  }
  removeBodyClasses();
}
function removeBodyClasses() {
  removeClass(
    [document.documentElement, document.body],
    [
      swalClasses.shown,
      swalClasses["height-auto"],
      swalClasses["no-backdrop"],
      swalClasses["toast-shown"]
    ]
  );
}
function close(resolveValue) {
  const popup = getPopup();
  if (!popup) {
    return;
  }
  resolveValue = prepareResolveValue(resolveValue);
  const innerParams = privateProps.innerParams.get(this);
  if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
    return;
  }
  const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
  removeClass(popup, innerParams.showClass.popup);
  addClass(popup, innerParams.hideClass.popup);
  const backdrop = getContainer();
  removeClass(backdrop, innerParams.showClass.backdrop);
  addClass(backdrop, innerParams.hideClass.backdrop);
  handlePopupAnimation(this, popup, innerParams);
  swalPromiseResolve(resolveValue);
}
const prepareResolveValue = (resolveValue) => {
  if (typeof resolveValue === "undefined") {
    return {
      isConfirmed: false,
      isDenied: false,
      isDismissed: true
    };
  }
  return Object.assign({
    isConfirmed: false,
    isDenied: false,
    isDismissed: false
  }, resolveValue);
};
const handlePopupAnimation = (instance, popup, innerParams) => {
  const container = getContainer();
  const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
  if (typeof innerParams.willClose === "function") {
    innerParams.willClose(popup);
  }
  if (animationIsSupported) {
    animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
  } else {
    removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
  }
};
const animatePopup = (instance, popup, container, returnFocus, didClose) => {
  globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
  popup.addEventListener(animationEndEvent, function(e) {
    if (e.target === popup) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
  });
};
const triggerDidCloseAndDispose = (instance, didClose) => {
  setTimeout(() => {
    if (typeof didClose === "function") {
      didClose.bind(instance.params)();
    }
    instance._destroy();
  });
};
function setButtonsDisabled(instance, buttons, disabled) {
  const domCache = privateProps.domCache.get(instance);
  buttons.forEach((button) => {
    domCache[button].disabled = disabled;
  });
}
function setInputDisabled(input, disabled) {
  if (!input) {
    return false;
  }
  if (input.type === "radio") {
    const radiosContainer = input.parentNode.parentNode;
    const radios = radiosContainer.querySelectorAll("input");
    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = disabled;
    }
  } else {
    input.disabled = disabled;
  }
}
function enableButtons() {
  setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
}
function disableButtons() {
  setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
}
function enableInput() {
  return setInputDisabled(this.getInput(), false);
}
function disableInput() {
  return setInputDisabled(this.getInput(), true);
}
function showValidationMessage(error2) {
  const domCache = privateProps.domCache.get(this);
  const params = privateProps.innerParams.get(this);
  setInnerHtml(domCache.validationMessage, error2);
  domCache.validationMessage.className = swalClasses["validation-message"];
  if (params.customClass && params.customClass.validationMessage) {
    addClass(domCache.validationMessage, params.customClass.validationMessage);
  }
  show(domCache.validationMessage);
  const input = this.getInput();
  if (input) {
    input.setAttribute("aria-invalid", true);
    input.setAttribute("aria-describedby", swalClasses["validation-message"]);
    focusInput(input);
    addClass(input, swalClasses.inputerror);
  }
}
function resetValidationMessage() {
  const domCache = privateProps.domCache.get(this);
  if (domCache.validationMessage) {
    hide(domCache.validationMessage);
  }
  const input = this.getInput();
  if (input) {
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    removeClass(input, swalClasses.inputerror);
  }
}
function getProgressSteps() {
  const domCache = privateProps.domCache.get(this);
  return domCache.progressSteps;
}
class Timer {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.running = false;
    this.start();
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.started = new Date();
      this.id = setTimeout(this.callback, this.remaining);
    }
    return this.remaining;
  }
  stop() {
    if (this.running) {
      this.running = false;
      clearTimeout(this.id);
      this.remaining -= new Date() - this.started;
    }
    return this.remaining;
  }
  increase(n) {
    const running = this.running;
    if (running) {
      this.stop();
    }
    this.remaining += n;
    if (running) {
      this.start();
    }
    return this.remaining;
  }
  getTimerLeft() {
    if (this.running) {
      this.stop();
      this.start();
    }
    return this.remaining;
  }
  isRunning() {
    return this.running;
  }
}
var defaultInputValidators = {
  email: (string, validationMessage) => {
    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
  },
  url: (string, validationMessage) => {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
  }
};
function setDefaultInputValidators(params) {
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach((key) => {
      if (params.input === key) {
        params.inputValidator = defaultInputValidators[key];
      }
    });
  }
}
function validateCustomTargetElement(params) {
  if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
    warn('Target parameter is not valid, defaulting to "body"');
    params.target = "body";
  }
}
function setParameters(params) {
  setDefaultInputValidators(params);
  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn(
      "showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"
    );
  }
  validateCustomTargetElement(params);
  if (typeof params.title === "string") {
    params.title = params.title.split("\n").join("<br />");
  }
  init(params);
}
const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
const getTemplateParams = (params) => {
  const template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
  if (!template) {
    return {};
  }
  const templateContent = template.content;
  showWarningsForElements(templateContent);
  const result = Object.assign(
    getSwalParams(templateContent),
    getSwalButtons(templateContent),
    getSwalImage(templateContent),
    getSwalIcon(templateContent),
    getSwalInput(templateContent),
    getSwalStringParams(templateContent, swalStringParams)
  );
  return result;
};
const getSwalParams = (templateContent) => {
  const result = {};
  toArray(templateContent.querySelectorAll("swal-param")).forEach((param) => {
    showWarningsForAttributes(param, ["name", "value"]);
    const paramName = param.getAttribute("name");
    let value = param.getAttribute("value");
    if (typeof defaultParams[paramName] === "boolean" && value === "false") {
      value = false;
    }
    if (typeof defaultParams[paramName] === "object") {
      value = JSON.parse(value);
    }
    result[paramName] = value;
  });
  return result;
};
const getSwalButtons = (templateContent) => {
  const result = {};
  toArray(templateContent.querySelectorAll("swal-button")).forEach((button) => {
    showWarningsForAttributes(button, ["type", "color", "aria-label"]);
    const type = button.getAttribute("type");
    result[`${type}ButtonText`] = button.innerHTML;
    result[`show${capitalizeFirstLetter(type)}Button`] = true;
    if (button.hasAttribute("color")) {
      result[`${type}ButtonColor`] = button.getAttribute("color");
    }
    if (button.hasAttribute("aria-label")) {
      result[`${type}ButtonAriaLabel`] = button.getAttribute("aria-label");
    }
  });
  return result;
};
const getSwalImage = (templateContent) => {
  const result = {};
  const image = templateContent.querySelector("swal-image");
  if (image) {
    showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
    if (image.hasAttribute("src")) {
      result.imageUrl = image.getAttribute("src");
    }
    if (image.hasAttribute("width")) {
      result.imageWidth = image.getAttribute("width");
    }
    if (image.hasAttribute("height")) {
      result.imageHeight = image.getAttribute("height");
    }
    if (image.hasAttribute("alt")) {
      result.imageAlt = image.getAttribute("alt");
    }
  }
  return result;
};
const getSwalIcon = (templateContent) => {
  const result = {};
  const icon = templateContent.querySelector("swal-icon");
  if (icon) {
    showWarningsForAttributes(icon, ["type", "color"]);
    if (icon.hasAttribute("type")) {
      result.icon = icon.getAttribute("type");
    }
    if (icon.hasAttribute("color")) {
      result.iconColor = icon.getAttribute("color");
    }
    result.iconHtml = icon.innerHTML;
  }
  return result;
};
const getSwalInput = (templateContent) => {
  const result = {};
  const input = templateContent.querySelector("swal-input");
  if (input) {
    showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
    result.input = input.getAttribute("type") || "text";
    if (input.hasAttribute("label")) {
      result.inputLabel = input.getAttribute("label");
    }
    if (input.hasAttribute("placeholder")) {
      result.inputPlaceholder = input.getAttribute("placeholder");
    }
    if (input.hasAttribute("value")) {
      result.inputValue = input.getAttribute("value");
    }
  }
  const inputOptions = templateContent.querySelectorAll("swal-input-option");
  if (inputOptions.length) {
    result.inputOptions = {};
    toArray(inputOptions).forEach((option2) => {
      showWarningsForAttributes(option2, ["value"]);
      const optionValue = option2.getAttribute("value");
      const optionName = option2.innerHTML;
      result.inputOptions[optionValue] = optionName;
    });
  }
  return result;
};
const getSwalStringParams = (templateContent, paramNames) => {
  const result = {};
  for (const i in paramNames) {
    const paramName = paramNames[i];
    const tag = templateContent.querySelector(paramName);
    if (tag) {
      showWarningsForAttributes(tag, []);
      result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
    }
  }
  return result;
};
const showWarningsForElements = (template) => {
  const allowedElements = swalStringParams.concat([
    "swal-param",
    "swal-button",
    "swal-image",
    "swal-icon",
    "swal-input",
    "swal-input-option"
  ]);
  toArray(template.children).forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    if (allowedElements.indexOf(tagName) === -1) {
      warn(`Unrecognized element <${tagName}>`);
    }
  });
};
const showWarningsForAttributes = (el, allowedAttributes) => {
  toArray(el.attributes).forEach((attribute) => {
    if (allowedAttributes.indexOf(attribute.name) === -1) {
      warn([
        `Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`,
        `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`
      ]);
    }
  });
};
const SHOW_CLASS_TIMEOUT = 10;
const openPopup = (params) => {
  const container = getContainer();
  const popup = getPopup();
  if (typeof params.willOpen === "function") {
    params.willOpen(popup);
  }
  const bodyStyles = window.getComputedStyle(document.body);
  const initialBodyOverflow = bodyStyles.overflowY;
  addClasses(container, popup, params);
  setTimeout(() => {
    setScrollingVisibility(container, popup);
  }, SHOW_CLASS_TIMEOUT);
  if (isModal()) {
    fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
    setAriaHidden();
  }
  if (!isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement;
  }
  if (typeof params.didOpen === "function") {
    setTimeout(() => params.didOpen(popup));
  }
  removeClass(container, swalClasses["no-transition"]);
};
const swalOpenAnimationFinished = (event) => {
  const popup = getPopup();
  if (event.target !== popup) {
    return;
  }
  const container = getContainer();
  popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
  container.style.overflowY = "auto";
};
const setScrollingVisibility = (container, popup) => {
  if (animationEndEvent && hasCssAnimation(popup)) {
    container.style.overflowY = "hidden";
    popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
  } else {
    container.style.overflowY = "auto";
  }
};
const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
  iOSfix();
  if (scrollbarPadding && initialBodyOverflow !== "hidden") {
    fixScrollbar();
  }
  setTimeout(() => {
    container.scrollTop = 0;
  });
};
const addClasses = (container, popup, params) => {
  addClass(container, params.showClass.backdrop);
  popup.style.setProperty("opacity", "0", "important");
  show(popup, "grid");
  setTimeout(() => {
    addClass(popup, params.showClass.popup);
    popup.style.removeProperty("opacity");
  }, SHOW_CLASS_TIMEOUT);
  addClass([document.documentElement, document.body], swalClasses.shown);
  if (params.heightAuto && params.backdrop && !params.toast) {
    addClass([document.documentElement, document.body], swalClasses["height-auto"]);
  }
};
const handleInputOptionsAndValue = (instance, params) => {
  if (params.input === "select" || params.input === "radio") {
    handleInputOptions(instance, params);
  } else if (["text", "email", "number", "tel", "textarea"].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
    showLoading(getConfirmButton());
    handleInputValue(instance, params);
  }
};
const getInputValue = (instance, innerParams) => {
  const input = instance.getInput();
  if (!input) {
    return null;
  }
  switch (innerParams.input) {
    case "checkbox":
      return getCheckboxValue(input);
    case "radio":
      return getRadioValue(input);
    case "file":
      return getFileValue(input);
    default:
      return innerParams.inputAutoTrim ? input.value.trim() : input.value;
  }
};
const getCheckboxValue = (input) => input.checked ? 1 : 0;
const getRadioValue = (input) => input.checked ? input.value : null;
const getFileValue = (input) => input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
const handleInputOptions = (instance, params) => {
  const popup = getPopup();
  const processInputOptions = (inputOptions) => populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);
  if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
    showLoading(getConfirmButton());
    asPromise(params.inputOptions).then((inputOptions) => {
      instance.hideLoading();
      processInputOptions(inputOptions);
    });
  } else if (typeof params.inputOptions === "object") {
    processInputOptions(params.inputOptions);
  } else {
    error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
  }
};
const handleInputValue = (instance, params) => {
  const input = instance.getInput();
  hide(input);
  asPromise(params.inputValue).then((inputValue) => {
    input.value = params.input === "number" ? parseFloat(inputValue) || 0 : `${inputValue}`;
    show(input);
    input.focus();
    instance.hideLoading();
  }).catch((err2) => {
    error(`Error in inputValue promise: ${err2}`);
    input.value = "";
    show(input);
    input.focus();
    instance.hideLoading();
  });
};
const populateInputOptions = {
  select: (popup, inputOptions, params) => {
    const select = getChildByClass(popup, swalClasses.select);
    const renderOption = (parent, optionLabel, optionValue) => {
      const option2 = document.createElement("option");
      option2.value = optionValue;
      setInnerHtml(option2, optionLabel);
      option2.selected = isSelected(optionValue, params.inputValue);
      parent.appendChild(option2);
    };
    inputOptions.forEach((inputOption) => {
      const optionValue = inputOption[0];
      const optionLabel = inputOption[1];
      if (Array.isArray(optionLabel)) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = optionValue;
        optgroup.disabled = false;
        select.appendChild(optgroup);
        optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
      } else {
        renderOption(select, optionLabel, optionValue);
      }
    });
    select.focus();
  },
  radio: (popup, inputOptions, params) => {
    const radio = getChildByClass(popup, swalClasses.radio);
    inputOptions.forEach((inputOption) => {
      const radioValue = inputOption[0];
      const radioLabel = inputOption[1];
      const radioInput = document.createElement("input");
      const radioLabelElement = document.createElement("label");
      radioInput.type = "radio";
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;
      if (isSelected(radioValue, params.inputValue)) {
        radioInput.checked = true;
      }
      const label = document.createElement("span");
      setInnerHtml(label, radioLabel);
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    const radios = radio.querySelectorAll("input");
    if (radios.length) {
      radios[0].focus();
    }
  }
};
const formatInputOptions = (inputOptions) => {
  const result = [];
  if (typeof Map !== "undefined" && inputOptions instanceof Map) {
    inputOptions.forEach((value, key) => {
      let valueFormatted = value;
      if (typeof valueFormatted === "object") {
        valueFormatted = formatInputOptions(valueFormatted);
      }
      result.push([key, valueFormatted]);
    });
  } else {
    Object.keys(inputOptions).forEach((key) => {
      let valueFormatted = inputOptions[key];
      if (typeof valueFormatted === "object") {
        valueFormatted = formatInputOptions(valueFormatted);
      }
      result.push([key, valueFormatted]);
    });
  }
  return result;
};
const isSelected = (optionValue, inputValue) => {
  return inputValue && inputValue.toString() === optionValue.toString();
};
const handleConfirmButtonClick = (instance, innerParams) => {
  instance.disableButtons();
  if (innerParams.input) {
    handleConfirmOrDenyWithInput(instance, innerParams, "confirm");
  } else {
    confirm(instance, innerParams, true);
  }
};
const handleDenyButtonClick = (instance, innerParams) => {
  instance.disableButtons();
  if (innerParams.returnInputValueOnDeny) {
    handleConfirmOrDenyWithInput(instance, innerParams, "deny");
  } else {
    deny(instance, innerParams, false);
  }
};
const handleCancelButtonClick = (instance, dismissWith) => {
  instance.disableButtons();
  dismissWith(DismissReason.cancel);
};
const handleConfirmOrDenyWithInput = (instance, innerParams, type) => {
  const inputValue = getInputValue(instance, innerParams);
  if (innerParams.inputValidator) {
    handleInputValidator(instance, innerParams, inputValue, type);
  } else if (!instance.getInput().checkValidity()) {
    instance.enableButtons();
    instance.showValidationMessage(innerParams.validationMessage);
  } else if (type === "deny") {
    deny(instance, innerParams, inputValue);
  } else {
    confirm(instance, innerParams, inputValue);
  }
};
const handleInputValidator = (instance, innerParams, inputValue, type) => {
  instance.disableInput();
  const validationPromise = Promise.resolve().then(
    () => asPromise(
      innerParams.inputValidator(inputValue, innerParams.validationMessage)
    )
  );
  validationPromise.then(
    (validationMessage) => {
      instance.enableButtons();
      instance.enableInput();
      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else if (type === "deny") {
        deny(instance, innerParams, inputValue);
      } else {
        confirm(instance, innerParams, inputValue);
      }
    }
  );
};
const deny = (instance, innerParams, value) => {
  if (innerParams.showLoaderOnDeny) {
    showLoading(getDenyButton());
  }
  if (innerParams.preDeny) {
    const preDenyPromise = Promise.resolve().then(
      () => asPromise(
        innerParams.preDeny(value, innerParams.validationMessage)
      )
    );
    preDenyPromise.then(
      (preDenyValue) => {
        if (preDenyValue === false) {
          instance.hideLoading();
        } else {
          instance.closePopup({ isDenied: true, value: typeof preDenyValue === "undefined" ? value : preDenyValue });
        }
      }
    );
  } else {
    instance.closePopup({ isDenied: true, value });
  }
};
const succeedWith = (instance, value) => {
  instance.closePopup({ isConfirmed: true, value });
};
const confirm = (instance, innerParams, value) => {
  if (innerParams.showLoaderOnConfirm) {
    showLoading();
  }
  if (innerParams.preConfirm) {
    instance.resetValidationMessage();
    const preConfirmPromise = Promise.resolve().then(
      () => asPromise(
        innerParams.preConfirm(value, innerParams.validationMessage)
      )
    );
    preConfirmPromise.then(
      (preConfirmValue) => {
        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
        } else {
          succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
        }
      }
    );
  } else {
    succeedWith(instance, value);
  }
};
const addKeydownHandler = (instance, globalState2, innerParams, dismissWith) => {
  if (globalState2.keydownTarget && globalState2.keydownHandlerAdded) {
    globalState2.keydownTarget.removeEventListener("keydown", globalState2.keydownHandler, { capture: globalState2.keydownListenerCapture });
    globalState2.keydownHandlerAdded = false;
  }
  if (!innerParams.toast) {
    globalState2.keydownHandler = (e) => keydownHandler(instance, e, dismissWith);
    globalState2.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
    globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
    globalState2.keydownTarget.addEventListener("keydown", globalState2.keydownHandler, { capture: globalState2.keydownListenerCapture });
    globalState2.keydownHandlerAdded = true;
  }
};
const setFocus = (innerParams, index2, increment) => {
  const focusableElements = getFocusableElements();
  if (focusableElements.length) {
    index2 = index2 + increment;
    if (index2 === focusableElements.length) {
      index2 = 0;
    } else if (index2 === -1) {
      index2 = focusableElements.length - 1;
    }
    return focusableElements[index2].focus();
  }
  getPopup().focus();
};
const arrowKeysNextButton = [
  "ArrowRight",
  "ArrowDown"
];
const arrowKeysPreviousButton = [
  "ArrowLeft",
  "ArrowUp"
];
const keydownHandler = (instance, e, dismissWith) => {
  const innerParams = privateProps.innerParams.get(instance);
  if (!innerParams) {
    return;
  }
  if (innerParams.stopKeydownPropagation) {
    e.stopPropagation();
  }
  if (e.key === "Enter") {
    handleEnter(instance, e, innerParams);
  } else if (e.key === "Tab") {
    handleTab(e, innerParams);
  } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
    handleArrows(e.key);
  } else if (e.key === "Escape") {
    handleEsc(e, innerParams, dismissWith);
  }
};
const handleEnter = (instance, e, innerParams) => {
  if (e.isComposing) {
    return;
  }
  if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
    if (["textarea", "file"].includes(innerParams.input)) {
      return;
    }
    clickConfirm();
    e.preventDefault();
  }
};
const handleTab = (e, innerParams) => {
  const targetElement = e.target;
  const focusableElements = getFocusableElements();
  let btnIndex = -1;
  for (let i = 0; i < focusableElements.length; i++) {
    if (targetElement === focusableElements[i]) {
      btnIndex = i;
      break;
    }
  }
  if (!e.shiftKey) {
    setFocus(innerParams, btnIndex, 1);
  } else {
    setFocus(innerParams, btnIndex, -1);
  }
  e.stopPropagation();
  e.preventDefault();
};
const handleArrows = (key) => {
  const confirmButton = getConfirmButton();
  const denyButton = getDenyButton();
  const cancelButton = getCancelButton();
  if (![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
    return;
  }
  const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
  const buttonToFocus = document.activeElement[sibling];
  if (buttonToFocus) {
    buttonToFocus.focus();
  }
};
const handleEsc = (e, innerParams, dismissWith) => {
  if (callIfFunction(innerParams.allowEscapeKey)) {
    e.preventDefault();
    dismissWith(DismissReason.esc);
  }
};
const handlePopupClick = (instance, domCache, dismissWith) => {
  const innerParams = privateProps.innerParams.get(instance);
  if (innerParams.toast) {
    handleToastClick(instance, domCache, dismissWith);
  } else {
    handleModalMousedown(domCache);
    handleContainerMousedown(domCache);
    handleModalClick(instance, domCache, dismissWith);
  }
};
const handleToastClick = (instance, domCache, dismissWith) => {
  domCache.popup.onclick = () => {
    const innerParams = privateProps.innerParams.get(instance);
    if (innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input) {
      return;
    }
    dismissWith(DismissReason.close);
  };
};
let ignoreOutsideClick = false;
const handleModalMousedown = (domCache) => {
  domCache.popup.onmousedown = () => {
    domCache.container.onmouseup = function(e) {
      domCache.container.onmouseup = void 0;
      if (e.target === domCache.container) {
        ignoreOutsideClick = true;
      }
    };
  };
};
const handleContainerMousedown = (domCache) => {
  domCache.container.onmousedown = () => {
    domCache.popup.onmouseup = function(e) {
      domCache.popup.onmouseup = void 0;
      if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
        ignoreOutsideClick = true;
      }
    };
  };
};
const handleModalClick = (instance, domCache, dismissWith) => {
  domCache.container.onclick = (e) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (ignoreOutsideClick) {
      ignoreOutsideClick = false;
      return;
    }
    if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
      dismissWith(DismissReason.backdrop);
    }
  };
};
function _main(userParams, mixinParams = {}) {
  showWarningsForParams(Object.assign({}, mixinParams, userParams));
  if (globalState.currentInstance) {
    globalState.currentInstance._destroy();
  }
  globalState.currentInstance = this;
  const innerParams = prepareParams(userParams, mixinParams);
  setParameters(innerParams);
  Object.freeze(innerParams);
  if (globalState.timeout) {
    globalState.timeout.stop();
    delete globalState.timeout;
  }
  clearTimeout(globalState.restoreFocusTimeout);
  const domCache = populateDomCache(this);
  render(this, innerParams);
  privateProps.innerParams.set(this, innerParams);
  return swalPromise(this, domCache, innerParams);
}
const prepareParams = (userParams, mixinParams) => {
  const templateParams = getTemplateParams(userParams);
  const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
  params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
  params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
  return params;
};
const swalPromise = (instance, domCache, innerParams) => {
  return new Promise((resolve) => {
    const dismissWith = (dismiss) => {
      instance.closePopup({ isDismissed: true, dismiss });
    };
    privateMethods.swalPromiseResolve.set(instance, resolve);
    domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance, innerParams);
    domCache.denyButton.onclick = () => handleDenyButtonClick(instance, innerParams);
    domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith);
    domCache.closeButton.onclick = () => dismissWith(DismissReason.close);
    handlePopupClick(instance, domCache, dismissWith);
    addKeydownHandler(instance, globalState, innerParams, dismissWith);
    handleInputOptionsAndValue(instance, innerParams);
    openPopup(innerParams);
    setupTimer(globalState, innerParams, dismissWith);
    initFocus(domCache, innerParams);
    setTimeout(() => {
      domCache.container.scrollTop = 0;
    });
  });
};
const populateDomCache = (instance) => {
  const domCache = {
    popup: getPopup(),
    container: getContainer(),
    actions: getActions(),
    confirmButton: getConfirmButton(),
    denyButton: getDenyButton(),
    cancelButton: getCancelButton(),
    loader: getLoader(),
    closeButton: getCloseButton(),
    validationMessage: getValidationMessage(),
    progressSteps: getProgressSteps$1()
  };
  privateProps.domCache.set(instance, domCache);
  return domCache;
};
const setupTimer = (globalState2, innerParams, dismissWith) => {
  const timerProgressBar = getTimerProgressBar();
  hide(timerProgressBar);
  if (innerParams.timer) {
    globalState2.timeout = new Timer(() => {
      dismissWith("timer");
      delete globalState2.timeout;
    }, innerParams.timer);
    if (innerParams.timerProgressBar) {
      show(timerProgressBar);
      setTimeout(() => {
        if (globalState2.timeout && globalState2.timeout.running) {
          animateTimerProgressBar(innerParams.timer);
        }
      });
    }
  }
};
const initFocus = (domCache, innerParams) => {
  if (innerParams.toast) {
    return;
  }
  if (!callIfFunction(innerParams.allowEnterKey)) {
    return blurActiveElement();
  }
  if (!focusButton(domCache, innerParams)) {
    setFocus(innerParams, -1, 1);
  }
};
const focusButton = (domCache, innerParams) => {
  if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
    domCache.denyButton.focus();
    return true;
  }
  if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
    domCache.cancelButton.focus();
    return true;
  }
  if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
    domCache.confirmButton.focus();
    return true;
  }
  return false;
};
const blurActiveElement = () => {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
};
function update(params) {
  const popup = getPopup();
  const innerParams = privateProps.innerParams.get(this);
  if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
    return warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
  }
  const validUpdatableParams = {};
  Object.keys(params).forEach((param) => {
    if (Swal.isUpdatableParameter(param)) {
      validUpdatableParams[param] = params[param];
    } else {
      warn(`Invalid parameter to update: "${param}". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js

If you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md`);
    }
  });
  const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
  render(this, updatedParams);
  privateProps.innerParams.set(this, updatedParams);
  Object.defineProperties(this, {
    params: {
      value: Object.assign({}, this.params, params),
      writable: false,
      enumerable: true
    }
  });
}
function _destroy() {
  const domCache = privateProps.domCache.get(this);
  const innerParams = privateProps.innerParams.get(this);
  if (!innerParams) {
    return;
  }
  if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback();
    delete globalState.swalCloseEventFinishedCallback;
  }
  if (globalState.deferDisposalTimer) {
    clearTimeout(globalState.deferDisposalTimer);
    delete globalState.deferDisposalTimer;
  }
  if (typeof innerParams.didDestroy === "function") {
    innerParams.didDestroy();
  }
  disposeSwal(this);
}
const disposeSwal = (instance) => {
  delete instance.params;
  delete globalState.keydownHandler;
  delete globalState.keydownTarget;
  unsetWeakMaps(privateProps);
  unsetWeakMaps(privateMethods);
};
const unsetWeakMaps = (obj) => {
  for (const i in obj) {
    obj[i] = /* @__PURE__ */ new WeakMap();
  }
};
var instanceMethods = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hideLoading,
  disableLoading: hideLoading,
  getInput,
  close,
  closePopup: close,
  closeModal: close,
  closeToast: close,
  enableButtons,
  disableButtons,
  enableInput,
  disableInput,
  showValidationMessage,
  resetValidationMessage,
  getProgressSteps,
  _main,
  update,
  _destroy
}, Symbol.toStringTag, { value: "Module" }));
let currentInstance;
class SweetAlert {
  constructor(...args) {
    if (typeof window === "undefined") {
      return;
    }
    currentInstance = this;
    const outerParams = Object.freeze(this.constructor.argsToParams(args));
    Object.defineProperties(this, {
      params: {
        value: outerParams,
        writable: false,
        enumerable: true,
        configurable: true
      }
    });
    const promise = this._main(this.params);
    privateProps.promise.set(this, promise);
  }
  then(onFulfilled) {
    const promise = privateProps.promise.get(this);
    return promise.then(onFulfilled);
  }
  finally(onFinally) {
    const promise = privateProps.promise.get(this);
    return promise.finally(onFinally);
  }
}
Object.assign(SweetAlert.prototype, instanceMethods);
Object.assign(SweetAlert, staticMethods);
Object.keys(instanceMethods).forEach((key) => {
  SweetAlert[key] = function(...args) {
    if (currentInstance) {
      return currentInstance[key](...args);
    }
  };
});
SweetAlert.DismissReason = DismissReason;
SweetAlert.version = "11.0.17";
const Swal = SweetAlert;
Swal.default = Swal;
var sweetalert2_min = "";
let viewBackState = [];
function get(index2 = null) {
  if (index2)
    return viewBackState[index2];
  return viewBackState;
}
function clean() {
  viewBackState = [];
}
function push({ name, instance, type, callback = null }) {
  viewBackState.push({ name, instance, type, callback });
}
function remove(name) {
  const index2 = viewBackState.findIndex((obj) => obj.name === name);
  if (index2 !== -1) {
    viewBackState.splice(index2, 1);
  }
}
const swalInstance = Swal.mixin({
  willOpen: function() {
    push({
      name: "swal",
      instance: Swal,
      type: "swal"
    });
  },
  didClose: () => {
    remove("swal");
  }
});
async function showAlert({ title, icon, timer = 0, showCancelButton = false }, afterFunction = null) {
  if (afterFunction && typeof afterFunction != "function") {
    throw new Error("\u5FC5\u9808\u662F function");
  }
  const result = await swalInstance.fire({
    title,
    icon,
    showCancelButton,
    timer
  });
  if (afterFunction) {
    afterFunction(result);
  }
}
var Directory;
(function(Directory2) {
  Directory2["Documents"] = "DOCUMENTS";
  Directory2["Data"] = "DATA";
  Directory2["Library"] = "LIBRARY";
  Directory2["Cache"] = "CACHE";
  Directory2["External"] = "EXTERNAL";
  Directory2["ExternalStorage"] = "EXTERNAL_STORAGE";
})(Directory || (Directory = {}));
var Encoding;
(function(Encoding2) {
  Encoding2["UTF8"] = "utf8";
  Encoding2["ASCII"] = "ascii";
  Encoding2["UTF16"] = "utf16";
})(Encoding || (Encoding = {}));
registerPlugin("Filesystem", {
  web: () => __vitePreload(() => import("./web.ccd96ec0.js"), true ? [] : void 0).then((m) => new m.FilesystemWeb())
});
const App = registerPlugin("App", {
  web: () => __vitePreload(() => import("./web.82c24f6c.js"), true ? [] : void 0).then((m) => new m.AppWeb())
});
const custom$1 = {
  BarAlertRange: {
    middle: 70,
    warning: 80,
    danger: 90
  }
};
const HomeLocation = "home";
const Mode = "t-mode";
const CurrentDateKey = "";
const CurrentAccountingIndex = 0;
const CurrentAccountings = [
  "\u7E3D\u89BD",
  "\u5176\u4ED6\u82B1\u8CBB"
];
const NewItemPosition = "top";
const ShowType = "number";
const DebugMode = false;
const Pickr$1 = {
  Swatches: [
    "#FF0000",
    "#00FF00",
    "#0000FF"
  ]
};
var defaultSetting = {
  custom: custom$1,
  HomeLocation,
  Mode,
  CurrentDateKey,
  CurrentAccountingIndex,
  CurrentAccountings,
  NewItemPosition,
  ShowType,
  DebugMode,
  Pickr: Pickr$1
};
async function initUserSetting() {
  let userSetting = {};
  userSetting.set = async (setting) => {
    await storage_setItem("UserSetting", setting);
    return await storage_getItem("UserSetting");
  };
  userSetting.get = async () => {
    var _a;
    return (_a = await storage_getItem("UserSetting")) != null ? _a : await userSetting.set(defaultSetting);
  };
  return userSetting;
}
var demo_Data = {
  "2024/06": {
    currentId: 9,
    totalGoal: {
      name: "\u672C\u6708\u6709\u8A2D\u5B9A\u7E3D\u984D",
      goal: {
        amount: 5e3,
        bonus: 0
      },
      current: {
        amount: 3400,
        bonus: 30
      }
    },
    items: {
      unset: {
        name: "\u5176\u4ED6\u82B1\u8CBB",
        current: {
          amount: 400,
          bonus: 100
        },
        accounting: [
          {
            id: 8,
            name: "\u5176\u4ED6\u82B1\u8CBB1",
            amount: 300,
            bonus: 100,
            date: "2024/07/19",
            created_at: "2024/07/22 00:00:00",
            unset: true
          },
          {
            id: 9,
            name: "\u5176\u4ED6\u82B1\u8CBB2",
            amount: 100,
            bonus: 0,
            date: "2024/07/22",
            created_at: "2024/07/22 00:00:00",
            unset: true
          }
        ],
        unset: true
      },
      normal: [
        {
          name: "\u6E2C\u8A66\u76EE\u6A191",
          goal: {
            amount: 500,
            bonus: 0
          },
          current: {
            amount: 700,
            bonus: 10
          },
          accounting: [
            {
              id: 0,
              name: "\u6E2C\u8A66\u8A18\u5E331-1",
              amount: 100,
              bonus: 0,
              date: "2024/07/22",
              created_at: "2024/07/22 00:00:00"
            },
            {
              id: 1,
              name: "\u6E2C\u8A66\u8A18\u5E331-2",
              amount: 500,
              bonus: 10,
              date: "2024/07/22",
              created_at: "2024/07/22 01:00:00"
            },
            {
              id: 2,
              name: "\u6E2C\u8A66\u8A18\u5E331-3",
              amount: 100,
              bonus: 0,
              date: "2024/07/10",
              created_at: "2024/07/22 02:00:00"
            }
          ],
          color: "#FFDC35",
          created_at: "2024/07/19 00:00:00"
        },
        {
          name: "\u6E2C\u8A66\u76EE\u6A192",
          goal: {
            amount: 500,
            bonus: 500
          },
          current: {
            amount: 800,
            bonus: 10
          },
          accounting: [
            {
              id: 3,
              name: "\u6E2C\u8A66\u8A18\u5E332-1",
              amount: 650,
              bonus: 5,
              date: "2024/07/24",
              created_at: "2024/07/24 00:00:00"
            },
            {
              id: 4,
              name: "\u6E2C\u8A66\u8A18\u5E332-2",
              amount: 150,
              bonus: 5,
              date: "2024/07/25",
              created_at: "2024/07/24 01:00:00"
            }
          ],
          color: "#FFBD9D",
          created_at: "2024/07/23 00:00:00"
        },
        {
          name: "\u6E2C\u8A66\u76EE\u6A193",
          goal: {
            amount: 500,
            bonus: 500
          },
          current: {
            amount: 900,
            bonus: 10
          },
          accounting: [
            {
              id: 5,
              name: "\u6E2C\u8A66\u8A18\u5E333-1",
              amount: 900,
              bonus: 10,
              date: "2024/07/22",
              created_at: "2024/07/23 00:00:00"
            }
          ],
          color: "#FFFFAA",
          created_at: "2024/07/21 01:00:00"
        },
        {
          name: "\u6E2C\u8A66\u76EE\u6A194",
          goal: {
            amount: 2e3,
            bonus: 100
          },
          current: {
            amount: 1e3,
            bonus: 0
          },
          accounting: [
            {
              id: 6,
              name: "\u6E2C\u8A66\u8A18\u5E334-1",
              amount: 500,
              bonus: 0,
              date: "2024/07/20",
              created_at: "2024/07/23 00:00:00"
            },
            {
              id: 7,
              name: "\u6E2C\u8A66\u8A18\u5E334-2",
              amount: 500,
              bonus: 0,
              date: "2024/07/10",
              created_at: "2024/07/23 00:00:00"
            }
          ],
          color: "#A8FF24",
          created_at: "2024/07/23 00:10:00"
        }
      ]
    }
  },
  "2024/07": {
    currentId: 0,
    totalGoal: {
      current: {
        amount: 41914,
        bonus: 50020
      }
    },
    items: {
      unset: {
        name: "\u5176\u4ED6\u82B1\u8CBB",
        current: {
          amount: 9999,
          bonus: 0
        },
        accounting: [],
        unset: true
      },
      normal: [
        {
          name: "\u540D\u5B57\u8D85\u9577\u7684\u6E2C\u8A666666666666666666666666666666666\u540D\u5B57\u8D85\u9577\u7684\u6E2C\u8A66GOGOGOGOGGGGGGGGGGGGGGGGGGGGGGGGGG",
          goal: {
            amount: 9250,
            bonus: 0
          },
          current: {
            amount: 9250,
            bonus: 0
          },
          accounting: [],
          color: "#A8FF24",
          created_at: "2024/07/23 00:00:00"
        },
        {
          name: "\u79DF\u91D1",
          goal: {
            amount: 9250,
            bonus: 0
          },
          current: {
            amount: 9250,
            bonus: 0
          },
          accounting: [],
          color: "#84C1FF",
          created_at: "2024/07/23 01:00:00"
        },
        {
          name: "\u96FB\u4FE1",
          goal: {
            amount: 799,
            bonus: 0
          },
          current: {
            amount: 799,
            bonus: 0
          },
          accounting: [],
          color: "#7AFEC6",
          created_at: "2024/07/23 00:10:00"
        },
        {
          name: "\u6C34\u96FB",
          goal: {
            amount: 200,
            bonus: 100
          },
          current: {
            amount: 0,
            bonus: 20
          },
          accounting: [],
          color: "#A23400",
          created_at: "2024/07/23 02:00:00"
        },
        {
          name: "\u7DB2\u8DEF",
          goal: {
            amount: 200,
            bonus: 100
          },
          current: {
            amount: 500,
            bonus: 0
          },
          accounting: [],
          color: "#D9B3B3",
          created_at: "2024/07/23 01:00:00"
        },
        {
          name: "\u5B78\u8CB8",
          goal: {
            amount: 0,
            bonus: 0
          },
          current: {
            amount: 100,
            bonus: 0
          },
          accounting: [],
          color: "#A3D1D1",
          created_at: "2024/07/23 00:00:11"
        },
        {
          name: "\u9910\u8CBB",
          goal: {
            amount: 7500,
            bonus: 2500
          },
          current: {
            amount: 1e3,
            bonus: 5e4
          },
          accounting: [],
          color: "#B766AD",
          created_at: "2024/07/23 02:00:00"
        },
        {
          name: "\u5132\u84C4\u96AA",
          goal: {
            amount: 0,
            bonus: 0
          },
          current: {
            amount: 0,
            bonus: 0
          },
          accounting: [],
          color: "#0066CC",
          created_at: "2024/07/23 03:00:00"
        },
        {
          name: "\u5A1B\u6A02",
          goal: {
            amount: 4e3,
            bonus: 0
          },
          current: {
            amount: 4e3,
            bonus: 0
          },
          accounting: [],
          color: "#F1E1FF",
          created_at: "2024/07/23 00:00:00"
        },
        {
          name: "\u4FDD\u96AA",
          goal: {
            amount: 1016,
            bonus: 0
          },
          current: {
            amount: 1016,
            bonus: 0
          },
          accounting: [],
          color: "#930093",
          created_at: "2024/07/23 00:00:00"
        },
        {
          name: "\u9810\u5099\u91D1/\u5132\u84C4",
          goal: {
            amount: 4e3,
            bonus: 0
          },
          current: {
            amount: 4e3,
            bonus: 0
          },
          accounting: [],
          color: "#FF0000",
          created_at: "2024/07/23 00:00:01"
        },
        {
          name: "\u5B5D\u89AA\u8CBB",
          goal: {
            amount: 2e3,
            bonus: 0
          },
          current: {
            amount: 2e3,
            bonus: 0
          },
          accounting: [],
          color: "#5B5B5B",
          created_at: "2024/07/23 00:00:01"
        }
      ]
    }
  }
};
function number2percent(number) {
  return Math.round(number * 1e4) / 100;
}
function convert2ThousandsSeparator(number) {
  return number.toLocaleString("en-US");
}
function getRandomLightColor() {
  let r, g, b;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (r * 0.299 + g * 0.587 + b * 0.114 < 186);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
function getCurrentFormattedDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
function getDayOfWeekToCalendar(d) {
  const date = new Date(d);
  const dayOfWeek = date.getDay();
  const daysOfWeek = ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D"];
  return daysOfWeek[dayOfWeek];
}
function getOffsetMonth(dateString, offset) {
  const [year, month] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1);
  date.setMonth(date.getMonth() + offset);
  const previousYear = date.getFullYear();
  const previousMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${previousYear}/${previousMonth}`;
}
async function initData() {
  let Data2 = {};
  let UserSetting2 = await initUserSetting();
  let UserSettingValue2 = await UserSetting2.get();
  if (UserSettingValue2.DebugMode == true) {
    await storage_remove("Data");
    await storage_setItem("Data", demo_Data);
  }
  Data2.set = async (data) => {
    await storage_setItem("Data", data);
    return await storage_getItem("Data");
  };
  Data2.get = async () => {
    var _a;
    return (_a = await storage_getItem("Data")) != null ? _a : await Data2.set(getDefault());
  };
  Data2.remove = async (date, nameArray = []) => {
    let data = await storage_getItem("Data");
    if (nameArray.length > 0) {
      data[date]["items"]["normal"] = data[date]["items"]["normal"].filter((item) => !nameArray.includes(item.name));
    } else {
      delete data[date]["goal"];
      data[date]["items"]["normal"] = [];
    }
    await storage_setItem("Data", data);
    return data;
  };
  Data2.getDefault = getDefault;
  return Data2;
}
function getDefault(formattedDate = null) {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  formattedDate = formattedDate != null ? formattedDate : `${year}/${month}`;
  return {
    [formattedDate]: {
      currentId: 0,
      totalGoal: {
        current: {
          amount: 0,
          bonus: 0
        }
      },
      items: {
        unset: {
          name: "\u5176\u4ED6\u82B1\u8CBB",
          current: {
            amount: 0,
            bonus: 0
          },
          accounting: [],
          unset: true
        },
        normal: []
      }
    }
  };
}
const color = {
  theme: {
    "default": "#005CFF"
  },
  bar: {
    amount: "#FFFFFF",
    bonus: "#999999",
    background: "#666666",
    number: {
      "default": "#FFFFFF",
      amountAlert: {
        middle: "#B8860B",
        warning: "#FFA500",
        danger: "#FF0000"
      }
    }
  }
};
var defaultStyle = {
  color
};
function getBarColor(path) {
  let current = defaultStyle.color.bar;
  const keys = path.split(".");
  for (const key of keys) {
    if (current[key] === void 0) {
      return void 0;
    }
    current = current[key];
  }
  return current;
}
function getAmountAlertColor(number) {
  const Range = defaultSetting.custom.BarAlertRange;
  const Colors = defaultStyle.color.bar.number;
  const AlertColors = Colors.amountAlert;
  if (number >= Range.warning && number < Range.danger)
    return AlertColors.warning;
  if (number >= Range.danger)
    return AlertColors.danger;
  return Colors.default;
}
function getDefaultColor() {
  return defaultStyle.color.theme.default;
}
/**!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
var version = "1.15.2";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(el, selector) {
  if (!selector)
    return;
  selector[0] === ">" && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx)
        break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style2 = el && el.style;
  if (style2) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style2) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style2[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, "transform");
      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window)
    return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top -= containerRect.top + parseInt(css(container, "border-top-width"));
          left -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }
    if (!visible)
      return parent;
    if (parent === getWindowScrollingElement())
      break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i))
      continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key])
        return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect)
    return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body)
          return getWindowScrollingElement();
        if (gotSelf || includeSelf)
          return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
function getChildContainingRectFromElement(container, options, ghostEl2) {
  var rect = {};
  Array.from(container.children).forEach(function(child) {
    var _rect$left, _rect$top, _rect$right, _rect$bottom;
    if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl2)
      return;
    var childRect = getRect(child);
    rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
    rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
    rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
    rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
  });
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
var expando = "Sortable" + new Date().getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation)
        return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost)
          return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function")
          callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function")
          callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function")
            callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p2) {
      if (p2.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault)
        return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults2, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2))
        continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function")
        return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable)
    return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl, parentEl, ghostEl, rootEl, nextEl, lastDownEl, cloneEl, cloneHidden, oldIndex, newIndex, oldDraggableIndex, newDraggableIndex, activeGroup, putSortable, awaitingDragStarted = false, ignoreNextClick = false, sortables = [], tapEvt, touchEvt, lastDx, lastDy, tapDistanceLeft, tapDistanceTop, moved, lastTarget, lastDirection, pastFirstInvertThresh = false, isCircumstantialInvert = false, targetMoveDistance, ghostRelativeParent, ghostRelativeParentInitialScroll = [], _silent = false, savedInputChecked = [];
var documentExists = typeof document !== "undefined", PositionGhostAbsolutely = IOS, CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float", supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div"), supportCssPointerEvents = function() {
  if (!documentExists)
    return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
}(), _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
}, _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
}, _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable))
      return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
}, _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
}, _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
}, _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists && !ChromeForAndroid) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults2 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    invertSwap: false,
    invertedSwapThreshold: null,
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults2);
  for (var name in defaults2) {
    !(name in options) && (options[name] = defaults2[name]);
  }
  _prepareGroup(options);
  for (var fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
      this[fn] = this[fn].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = {
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable)
      return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err2) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent)
          break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = parent.parentNode);
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document)
            ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled)
        return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent)
      return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled)
      return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled)
        return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function(el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  toArray: function toArray2() {
    var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  sort: function sort(order, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled)
        return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled)
        return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array)
    plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils)
      Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [], scrollEl, scrollRootEl, scrolling = false, lastAutoScrollX, lastAutoScrollY, touchEvt$1, pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll)
    return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval(function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent)
    return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
Sortable.mount(new AutoScrollPlugin());
let sortableInstance;
async function initDataContent(DataValue2, UserSettingValue2) {
  const keyArray = Object.keys(DataValue2);
  UserSettingValue2.CurrentDateKey = keyArray[keyArray.length - 1];
  let UserSetting2 = await initUserSetting();
  await UserSetting2.set(UserSettingValue2);
  renderCarouselData(UserSettingValue2.CurrentDateKey);
  renderDataContent(DataValue2, UserSettingValue2);
  renderUserSettingContent(UserSettingValue2);
}
function renderDataContent(data, { CurrentDateKey: CurrentDateKey2, ...param }) {
  const HomeContent = document.querySelector("#home-content");
  const mode = (param == null ? void 0 : param.Mode) ? param.Mode : "t-mode";
  const showType = (param == null ? void 0 : param.ShowType) ? param.ShowType : "number";
  let d;
  if (!CurrentDateKey2) {
    const keyArray = Object.keys(data);
    const lastKey = keyArray[keyArray.length - 1];
    d = data[lastKey];
  } else {
    d = data[CurrentDateKey2];
  }
  let html = renderItemsHTML(d, mode);
  HomeContent.innerHTML = html;
  const d_noneClassName = showType == "number" ? "percent" : "number";
  HomeContent.querySelectorAll(".progress-item").forEach((progress_item) => {
    progress_item.querySelectorAll(`span.${showType}`).forEach((item) => {
      item.classList.remove("d-none");
    });
  });
  HomeContent.querySelectorAll(".progress-item").forEach((progress_item) => {
    progress_item.querySelectorAll(`span.${d_noneClassName}`).forEach((item) => {
      item.classList.add("d-none");
    });
  });
  renderSortable(HomeContent);
  document.querySelector("#item-main-nav").classList.add("d-none");
  debugMode(param == null ? void 0 : param.DebugMode);
}
function renderItemsHTML(data, mode) {
  let items = data.items.normal;
  let html = "";
  let html_option = "";
  for (let item2 of items) {
    html += renderBarHTML(item2, {
      mode
    });
    html_option += renderAccountingOptionHTML(item2.name);
  }
  html_option += renderAccountingOptionHTML(data.items.unset.name, true);
  let item = data.items.unset;
  if (item.accounting.length > 0) {
    html += renderBarHTML(item, {
      mode,
      unset: true
    });
  }
  document.querySelector(".goal-options").innerHTML = html_option;
  let total_html = renderBarHTML(data.totalGoal, {
    mode
  }, true);
  if (items.length == 0) {
    html += "<div class='text-center h4'>\u5C1A\u672A\u5EFA\u7ACB\u76EE\u6A19\uFF0C\u8ACB\u5148\u65B0\u589E</div>";
  }
  return total_html + html;
}
function renderBarHTML(item, param, isGoal) {
  var _a;
  let name = (_a = item == null ? void 0 : item.name) != null ? _a : "\u672C\u6708\u5408\u8A08";
  const mode = param == null ? void 0 : param.mode;
  const goal = item == null ? void 0 : item.goal;
  const current = item == null ? void 0 : item.current;
  const backgroundColor = item.color || param.unset ? "#84C1FF" : getDefaultColor();
  const textBackgroundColor = item.color ? item.color : "#84C1FF";
  let progressHTML = "";
  if (isGoal || param.unset) {
    if (mode == "i-mode" && param.imode == "bonus")
      return "";
    if (!current)
      return "";
    let percent_html = "";
    let number_html = "";
    let color_html = "white";
    let progress_html = "";
    let currentNumber = current.amount + current.bonus;
    if (goal) {
      const total = goal.amount + goal.bonus;
      let value = [
        number2percent(current.amount / (total || 1)),
        number2percent(current.bonus / (total || 1))
      ];
      value[2] = 100 - value[0] - value[1];
      const percent = number2percent((current.amount + current.bonus) / (goal.amount + goal.bonus || 1));
      color_html = getAmountAlertColor(value[0] + value[1]);
      percent_html = `<span class="percent d-none" style="color: ${color_html}">${percent}%</span>`;
      number_html = `${convert2ThousandsSeparator(currentNumber)}/${convert2ThousandsSeparator(total)}`;
      progress_html = `
                <div class="progress-bar" role="progressbar" style="width: ${value[0]}%; background-color: ${getBarColor("amount")};" aria-valuenow="${value[0]}" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar" role="progressbar" style="width: ${value[1]}%; background-color: ${getBarColor("bonus")};" aria-valuenow="${value[1]}" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar" role="progressbar" style="width: ${value[2]}%; background-color: ${getBarColor("background")};" aria-valuenow="${value[2]}" aria-valuemin="0" aria-valuemax="100"></div>
            `;
    } else {
      percent_html = `<span class="percent d-none" style="color: white">$${convert2ThousandsSeparator(currentNumber)}</span>`;
      number_html = convert2ThousandsSeparator(currentNumber);
      progress_html = `<div class="progress-bar" role="progressbar" style="width: 100%; background-color: ${getBarColor("amount")};" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>`;
    }
    progressHTML = `
            <div class="d-flex justify-content-end">
                <span class="progress-item mb-1">
                    ${percent_html}
                    <span class="number" style="color: ${color_html}">$${number_html}</span>
                </span>
            </div>
            <div class="progress">${progress_html}</div>
        `;
  } else {
    const total = goal.amount + goal.bonus;
    let currentNumber, goalNumber;
    let value = [
      number2percent(current.amount / (total || 1)),
      number2percent(current.bonus / (total || 1))
    ];
    value[2] = 100 - value[0] - value[1];
    const percent = number2percent((current.amount + current.bonus) / (goal.amount + goal.bonus || 1));
    if (mode == "t-mode") {
      currentNumber = current.amount + current.bonus;
      goalNumber = total;
      progressHTML = `
                <div class="d-flex justify-content-end">
                    <span class="progress-item mb-1">
                        <span class="percent d-none" style="color: ${getAmountAlertColor(value[0] + value[1])}">${percent}%</span>
                        <span class="number" style="color: ${getAmountAlertColor(value[0] + value[1])}">$${convert2ThousandsSeparator(currentNumber)}/${convert2ThousandsSeparator(goalNumber)}</span>
                    </span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${value[0]}%; background-color: ${getBarColor("amount")};" aria-valuenow="${value[0]}" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar" role="progressbar" style="width: ${value[1]}%; background-color: ${getBarColor("bonus")};" aria-valuenow="${value[1]}" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar" role="progressbar" style="width: ${value[2]}%; background-color: ${getBarColor("background")};" aria-valuenow="${value[2]}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
    }
    if (mode == "it-mode") {
      value[3] = number2percent(current.amount / (goal.amount || 1));
      value[4] = number2percent(current.bonus / (goal.bonus || 1));
      let bonusPercentText = goal.bonus != 0 ? `(<span style="color: ${getAmountAlertColor(value[4])}">+${value[4]}</span>%)` : "";
      let bonusNumberText = "";
      if (goal.bonus == 0 && current.bonus != 0)
        bonusNumberText = `<span style="color: ${getAmountAlertColor(value[4])}">(+${convert2ThousandsSeparator(current.bonus)})</span>`;
      if (goal.bonus != 0 && current.bonus != 0)
        bonusNumberText = `<span style="color: ${getAmountAlertColor(value[4])}">(+${convert2ThousandsSeparator(current.bonus)}/${convert2ThousandsSeparator(goal.bonus)})</span>`;
      progressHTML = `
                <div class="d-flex justify-content-end">
                    <span class="progress-item mb-1">
                        <span class="percent d-none">
                            <span style="color: ${getAmountAlertColor(value[3])}">${value[3]}%</span>${bonusPercentText}
                        </span>
                        <span class="number">
                            <span style="color: ${getAmountAlertColor(value[3])}">$${convert2ThousandsSeparator(current.amount)}/${convert2ThousandsSeparator(goal.amount)}</span>${bonusNumberText}
                        </span>
                    </span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${value[0]}%; background-color: ${getBarColor("amount")};" aria-valuenow="${value[0]}" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar" role="progressbar" style="width: ${value[1]}%; background-color: ${getBarColor("bonus")};" aria-valuenow="${value[1]}" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar" role="progressbar" style="width: ${value[2]}%; background-color: ${getBarColor("background")};" aria-valuenow="${value[2]}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
    }
    if (mode == "i-mode") {
      let barColor;
      if (param.imode == "amount") {
        value[0] = number2percent(current.amount / (goal.amount || 1));
        currentNumber = convert2ThousandsSeparator(current.amount);
        goalNumber = convert2ThousandsSeparator(goal.amount);
        barColor = "amount";
        name = "\u76EE\u6A19\u91D1\u984D";
      }
      if (param.imode == "bonus") {
        if (!current.bonus && !goal.bonus || !goal.bonus && item.unset === true)
          return "";
        value[0] = number2percent(current.bonus / (goal.bonus || 1));
        currentNumber = convert2ThousandsSeparator(current.bonus);
        goalNumber = convert2ThousandsSeparator(goal.bonus);
        barColor = "bonus";
        name = "\u984D\u5916\u91D1\u984D";
        if (!goal.bonus)
          name += "(\u672A\u8A2D\u5B9A)";
      }
      value[1] = 100 - value[0];
      let perc = number2percent(value[0] / 100);
      progressHTML = `
                <div class="d-flex justify-content-end">
                    <span class="progress-item mb-1">
                        <span class="percent d-none" style="color: ${getAmountAlertColor(perc)}">[${perc}%]</span>
                        <span class="number" style="color: ${getAmountAlertColor(perc)}">$${convert2ThousandsSeparator(currentNumber)}/${convert2ThousandsSeparator(goalNumber)}</span>
                    </span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${value[0]}%; background-color: ${getBarColor(barColor)};" aria-valuenow="${value[0]}" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar" role="progressbar" style="width: ${value[1]}%; background-color: ${getBarColor("background")};" aria-valuenow="${value[1]}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
    }
  }
  return render2(name, mode, progressHTML, backgroundColor, isGoal);
  function render2(name2, mode2, progressHTML2, backgroundColor2, isGoal2 = false) {
    let html;
    const check_input_html = param.unset ? "" : `<input class="form-check-input mb-auto select_item" type="checkbox">`;
    const nav_html = `
            <div class="d-flex ms-auto align-items-center gap-2 mb-1 d-none nav_item">
                ${check_input_html}
                <i class="bi bi-filter-circle-fill mb-auto sort_item"></i>
                <!--
                <i class="bi bi-three-dots setting_item" data-bs-toggle="dropdown"></i>
                <ul class="dropdown-menu item-setting-dropdown" data-name="${name2}">
                    <li><a class="dropdown-item fw-bold h5" data-action="detail"><i class="bi bi-journal-text"></i>&nbsp\u8A73\u7D30</a></li>
                    <li><a class="dropdown-item fw-bold h5" data-action="rename"><i class="bi bi-pencil-square"></i>&nbsp;\u91CD\u65B0\u547D\u540D</a></li>
                    <li><a class="dropdown-item fw-bold h5 text-danger" data-action="delete"><i class="bi bi-trash3-fill"></i>&nbsp;\u522A\u9664</a></li>
                </ul>
                -->
            </div>
        `;
    const icon_html = isGoal2 || mode2 == "i-mode" || param.unset ? "" : `<i class="bi bi-circle-fill" style="color: ${textBackgroundColor}; font-size: 12px"></i>`;
    html = `
            <div class="${isGoal2 || param.unset ? "unsortable" : "items"} items-rounded" data-sort-name="${name2}" style="background-color: ${backgroundColor2}">
                <div class="pb-4 pt-4 mt-2 mb-2 ms-4 me-4">
                    <div class="d-flex align-items-center justify-content-start mb-2 gap-2">
                        ${icon_html}
                        <label class="form-label text-light h5 mb-1 item-long-word mw-100 ${mode2 == "i-mode" ? "text-center flex-grow-1" : ""}">${name2}</label>
                        ${isGoal2 ? "" : nav_html}
                    </div>
                    ${progressHTML2}
                </div>
            </div>
        `;
    return html;
  }
}
function renderAccountingDetail(items, goal) {
  let d;
  if (!goal || goal == "\u7E3D\u89BD")
    d = [...items.normal, items.unset];
  else if (goal == "\u5176\u4ED6\u82B1\u8CBB")
    d = [items.unset];
  else
    d = [items.normal.find((item) => item.name == goal)];
  const allAccounting = d.flatMap(
    (item) => item.accounting.map((accountingItem) => ({
      ...accountingItem,
      goalName: item.name,
      color: item.color,
      unset: (item == null ? void 0 : item.unset) == true ? true : false
    }))
  ).sort((b, a) => new Date(a.date) - new Date(b.date));
  const AccountingDetailContent = document.querySelector("#accountingDetail-content");
  const groupedByDate = allAccounting.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("zh-TW", { year: "numeric", month: "numeric", day: "numeric" });
    if (!acc[date]) {
      acc[date] = {
        name: item.goalName,
        items: []
      };
    }
    acc[date].items.push(item);
    return acc;
  }, {});
  console.log(groupedByDate);
  let html = "";
  for (let group in groupedByDate) {
    let acc_html = "";
    let total = 0;
    let count = 0;
    groupedByDate[group].items.forEach((accounting) => {
      if (count != 0) {
        acc_html += `<div class="border border-1"></div>`;
      }
      let accountingTag_html = accounting.unset ? "" : `<span class="fw-bold rounded-pill accounting-goal" data-goal="${accounting.goalName}" style="background-color: ${accounting.color}">${accounting.goalName}</span>`;
      acc_html += `
                <div class="d-flex align-items-center justify-content-between accounting-item" data-id="${accounting.id}" style="height: ${accounting.bonus > 0 ? "2.8em" : "1.8em"}">
                    <div>
                        ${accountingTag_html}
                        <span class="accounting-name">${accounting.name}</span>
                    </div>
                    <div class="d-flex flex-column accounting-money" data-amount="${accounting.amount}" data-bonus="${accounting.bonus}">
                        <div class="d-flex justify-content-end">$ ${convert2ThousandsSeparator(accounting.amount)}</div>
                        ${accounting.bonus > 0 ? `<div class="d-flex justify-content-end">$ ${convert2ThousandsSeparator(accounting.bonus)}</div>` : ""}
                    </div>
                </div>
            `;
      total += Number(accounting.amount);
      count++;
    });
    html += `
            <div class="mb-2 border border-secondary border-1 rounded accounting-group">
                <div class="form-label fw-bold d-flex align-items-center justify-content-between m-1 accounting-date"
                    data-date="${group}">
                    <span>${group} (${getDayOfWeekToCalendar(group)})</span>
                    <span>$ ${convert2ThousandsSeparator(total)}</span>
                </div>
                <div class="border-top border-secondary"></div>
                <div class="m-1">${acc_html}</div>
            </div>
        `;
  }
  AccountingDetailContent.innerHTML = html;
}
function renderCarouselData(value) {
  const CarouselInner = document.querySelector("#carouselData .carousel-inner .carousel-item.active");
  const date = value.split("/");
  CarouselInner.dataset.value = value;
  CarouselInner.innerHTML = `${date[0]}\u5E74${date[1]}\u6708`;
}
function renderCarouselAccountingData(value) {
  const CarouselInner = document.querySelector("#carouselAccountingNameData .carousel-inner .carousel-item.active");
  CarouselInner.dataset.value = value;
  CarouselInner.innerHTML = value;
}
function renderSortable(element) {
  if (sortableInstance) {
    sortableInstance.destroy();
  }
  document.querySelector(".data-content");
  const scrollSensitivity = 20;
  sortableInstance = Sortable.create(element, {
    handle: ".sort_item",
    animation: 150,
    scroll: true,
    forceAutoScrollFallback: true,
    scrollSensitivity,
    scrollSpeed: 20,
    bubbleScroll: true,
    dataIdAttr: "data-sort-name",
    ghostClass: "sortable-ghost",
    dragClass: "sortable-drag",
    onStart: function(event) {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    },
    onMove: function(event) {
      if (event.related && event.related.classList.contains("unsortable")) {
        return false;
      }
    },
    onEnd: function(event) {
    },
    onUpdate: async function(event) {
      const newOrder = sortableInstance.toArray();
      newOrder.shift(0);
      await updateDataItemsSort(newOrder);
    }
  });
}
function renderAccountingOptionHTML(goal, isUnset = false) {
  return `<option value="${goal}" ${isUnset ? "data-unset" : ""}>${goal}</option>`;
}
function renderGoalDetailModal(targetName, data) {
  const GoalDetailModal = document.querySelector("#goalDetailModal");
  const titleSpan = GoalDetailModal.querySelector(".modal-title-span");
  const renameInput = GoalDetailModal.querySelector(".modal-title-input");
  titleSpan.textContent = targetName;
  renameInput.textContent = targetName;
  let amount_html = renderBarHTML(data, {
    mode: "i-mode",
    imode: "amount"
  });
  let bonus_html = renderBarHTML(data, {
    mode: "i-mode",
    imode: "bonus"
  });
  let html = amount_html + bonus_html;
  GoalDetailModal.querySelector(".modal-body").innerHTML = html;
}
function renderUserSettingContent(userSetting) {
  const SettingContent = document.querySelector("#setting-content");
  const HomeLocation2 = SettingContent.querySelector("#HomeLocation");
  const Mode2 = SettingContent.querySelector("#Mode");
  const ShowType2 = SettingContent.querySelector("#ShowType");
  const NewItemPosition2 = SettingContent.querySelector("#NewItemPosition");
  const DebugMode2 = SettingContent.querySelector("#DebugMode");
  HomeLocation2.checked = userSetting.HomeLocation == "home" ? true : false;
  Mode2.checked = userSetting.Mode == "t-mode" ? true : false;
  ShowType2.checked = userSetting.ShowType == "number" ? true : false;
  NewItemPosition2.checked = userSetting.NewItemPosition == "top" ? true : false;
  DebugMode2.checked = userSetting.DebugMode;
}
function debugMode(debugMode2) {
  let debug_items = document.querySelectorAll(".debug");
  debug_items.forEach((item) => {
    if (debugMode2) {
      item.style.display = "inline";
    } else {
      item.style.display = "none";
    }
  });
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var pickr_min = { exports: {} };
/*! Pickr 1.9.1 MIT | https://github.com/Simonwep/pickr */
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(self, () => (() => {
    var t = { d: (e2, o2) => {
      for (var n2 in o2)
        t.o(o2, n2) && !t.o(e2, n2) && Object.defineProperty(e2, n2, { enumerable: true, get: o2[n2] });
    }, o: (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), r: (t2) => {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
    } }, e = {};
    t.d(e, { default: () => E });
    var o = {};
    function n(t2, e2, o2, n2, i2 = {}) {
      e2 instanceof HTMLCollection || e2 instanceof NodeList ? e2 = Array.from(e2) : Array.isArray(e2) || (e2 = [e2]), Array.isArray(o2) || (o2 = [o2]);
      for (const s2 of e2)
        for (const e3 of o2)
          s2[t2](e3, n2, { capture: false, ...i2 });
      return Array.prototype.slice.call(arguments, 1);
    }
    t.r(o), t.d(o, { adjustableInputNumbers: () => p2, createElementFromString: () => r, createFromTemplate: () => a, eventPath: () => l, off: () => s, on: () => i, resolveElement: () => c });
    const i = n.bind(null, "addEventListener"), s = n.bind(null, "removeEventListener");
    function r(t2) {
      const e2 = document.createElement("div");
      return e2.innerHTML = t2.trim(), e2.firstElementChild;
    }
    function a(t2) {
      const e2 = (t3, e3) => {
        const o3 = t3.getAttribute(e3);
        return t3.removeAttribute(e3), o3;
      }, o2 = (t3, n2 = {}) => {
        const i2 = e2(t3, ":obj"), s2 = e2(t3, ":ref"), r2 = i2 ? n2[i2] = {} : n2;
        s2 && (n2[s2] = t3);
        for (const n3 of Array.from(t3.children)) {
          const t4 = e2(n3, ":arr"), i3 = o2(n3, t4 ? {} : r2);
          t4 && (r2[t4] || (r2[t4] = [])).push(Object.keys(i3).length ? i3 : n3);
        }
        return n2;
      };
      return o2(r(t2));
    }
    function l(t2) {
      let e2 = t2.path || t2.composedPath && t2.composedPath();
      if (e2)
        return e2;
      let o2 = t2.target.parentElement;
      for (e2 = [t2.target, o2]; o2 = o2.parentElement; )
        e2.push(o2);
      return e2.push(document, window), e2;
    }
    function c(t2) {
      return t2 instanceof Element ? t2 : "string" == typeof t2 ? t2.split(/>>/g).reduce((t3, e2, o2, n2) => (t3 = t3.querySelector(e2), o2 < n2.length - 1 ? t3.shadowRoot : t3), document) : null;
    }
    function p2(t2, e2 = (t3) => t3) {
      function o2(o3) {
        const n2 = [1e-3, 0.01, 0.1][Number(o3.shiftKey || 2 * o3.ctrlKey)] * (o3.deltaY < 0 ? 1 : -1);
        let i2 = 0, s2 = t2.selectionStart;
        t2.value = t2.value.replace(/[\d.]+/g, (t3, o4) => o4 <= s2 && o4 + t3.length >= s2 ? (s2 = o4, e2(Number(t3), n2, i2)) : (i2++, t3)), t2.focus(), t2.setSelectionRange(s2, s2), o3.preventDefault(), t2.dispatchEvent(new Event("input"));
      }
      i(t2, "focus", () => i(window, "wheel", o2, { passive: false })), i(t2, "blur", () => s(window, "wheel", o2));
    }
    const { min: u, max: h2, floor: d, round: m } = Math;
    function f(t2, e2, o2) {
      e2 /= 100, o2 /= 100;
      const n2 = d(t2 = t2 / 360 * 6), i2 = t2 - n2, s2 = o2 * (1 - e2), r2 = o2 * (1 - i2 * e2), a2 = o2 * (1 - (1 - i2) * e2), l2 = n2 % 6;
      return [255 * [o2, r2, s2, s2, a2, o2][l2], 255 * [a2, o2, o2, r2, s2, s2][l2], 255 * [s2, s2, a2, o2, o2, r2][l2]];
    }
    function v(t2, e2, o2) {
      const n2 = (2 - (e2 /= 100)) * (o2 /= 100) / 2;
      return 0 !== n2 && (e2 = 1 === n2 ? 0 : n2 < 0.5 ? e2 * o2 / (2 * n2) : e2 * o2 / (2 - 2 * n2)), [t2, 100 * e2, 100 * n2];
    }
    function b(t2, e2, o2) {
      const n2 = u(t2 /= 255, e2 /= 255, o2 /= 255), i2 = h2(t2, e2, o2), s2 = i2 - n2;
      let r2, a2;
      if (0 === s2)
        r2 = a2 = 0;
      else {
        a2 = s2 / i2;
        const n3 = ((i2 - t2) / 6 + s2 / 2) / s2, l2 = ((i2 - e2) / 6 + s2 / 2) / s2, c2 = ((i2 - o2) / 6 + s2 / 2) / s2;
        t2 === i2 ? r2 = c2 - l2 : e2 === i2 ? r2 = 1 / 3 + n3 - c2 : o2 === i2 && (r2 = 2 / 3 + l2 - n3), r2 < 0 ? r2 += 1 : r2 > 1 && (r2 -= 1);
      }
      return [360 * r2, 100 * a2, 100 * i2];
    }
    function y(t2, e2, o2, n2) {
      e2 /= 100, o2 /= 100;
      return [...b(255 * (1 - u(1, (t2 /= 100) * (1 - (n2 /= 100)) + n2)), 255 * (1 - u(1, e2 * (1 - n2) + n2)), 255 * (1 - u(1, o2 * (1 - n2) + n2)))];
    }
    function g(t2, e2, o2) {
      e2 /= 100;
      const n2 = 2 * (e2 *= (o2 /= 100) < 0.5 ? o2 : 1 - o2) / (o2 + e2) * 100, i2 = 100 * (o2 + e2);
      return [t2, isNaN(n2) ? 0 : n2, i2];
    }
    function _(t2) {
      return b(...t2.match(/.{2}/g).map((t3) => parseInt(t3, 16)));
    }
    function w(t2) {
      t2 = t2.match(/^[a-zA-Z]+$/) ? function(t3) {
        if ("black" === t3.toLowerCase())
          return "#000";
        const e3 = document.createElement("canvas").getContext("2d");
        return e3.fillStyle = t3, "#000" === e3.fillStyle ? null : e3.fillStyle;
      }(t2) : t2;
      const e2 = { cmyk: /^cmyk\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)/i, rgba: /^rgba?\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D*?(([\d.]+)(%?)|$)/i, hsla: /^hsla?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i, hsva: /^hsva?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i, hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i }, o2 = (t3) => t3.map((t4) => /^(|\d+)\.\d+|\d+$/.test(t4) ? Number(t4) : void 0);
      let n2;
      t:
        for (const i2 in e2)
          if (n2 = e2[i2].exec(t2))
            switch (i2) {
              case "cmyk": {
                const [, t3, e3, s2, r2] = o2(n2);
                if (t3 > 100 || e3 > 100 || s2 > 100 || r2 > 100)
                  break t;
                return { values: y(t3, e3, s2, r2), type: i2 };
              }
              case "rgba": {
                let [, t3, , e3, , s2, , , r2] = o2(n2);
                if (t3 = "%" === n2[2] ? t3 / 100 * 255 : t3, e3 = "%" === n2[4] ? e3 / 100 * 255 : e3, s2 = "%" === n2[6] ? s2 / 100 * 255 : s2, r2 = "%" === n2[9] ? r2 / 100 : r2, t3 > 255 || e3 > 255 || s2 > 255 || r2 < 0 || r2 > 1)
                  break t;
                return { values: [...b(t3, e3, s2), r2], a: r2, type: i2 };
              }
              case "hexa": {
                let [, t3] = n2;
                4 !== t3.length && 3 !== t3.length || (t3 = t3.split("").map((t4) => t4 + t4).join(""));
                const e3 = t3.substring(0, 6);
                let o3 = t3.substring(6);
                return o3 = o3 ? parseInt(o3, 16) / 255 : void 0, { values: [..._(e3), o3], a: o3, type: i2 };
              }
              case "hsla": {
                let [, t3, e3, s2, , r2] = o2(n2);
                if (r2 = "%" === n2[6] ? r2 / 100 : r2, t3 > 360 || e3 > 100 || s2 > 100 || r2 < 0 || r2 > 1)
                  break t;
                return { values: [...g(t3, e3, s2), r2], a: r2, type: i2 };
              }
              case "hsva": {
                let [, t3, e3, s2, , r2] = o2(n2);
                if (r2 = "%" === n2[6] ? r2 / 100 : r2, t3 > 360 || e3 > 100 || s2 > 100 || r2 < 0 || r2 > 1)
                  break t;
                return { values: [t3, e3, s2, r2], a: r2, type: i2 };
              }
            }
      return { values: null, type: null };
    }
    function A(t2 = 0, e2 = 0, o2 = 0, n2 = 1) {
      const i2 = (t3, e3) => (o3 = -1) => e3(~o3 ? t3.map((t4) => Number(t4.toFixed(o3))) : t3), s2 = { h: t2, s: e2, v: o2, a: n2, toHSVA() {
        const t3 = [s2.h, s2.s, s2.v, s2.a];
        return t3.toString = i2(t3, (t4) => `hsva(${t4[0]}, ${t4[1]}%, ${t4[2]}%, ${s2.a})`), t3;
      }, toHSLA() {
        const t3 = [...v(s2.h, s2.s, s2.v), s2.a];
        return t3.toString = i2(t3, (t4) => `hsla(${t4[0]}, ${t4[1]}%, ${t4[2]}%, ${s2.a})`), t3;
      }, toRGBA() {
        const t3 = [...f(s2.h, s2.s, s2.v), s2.a];
        return t3.toString = i2(t3, (t4) => `rgba(${t4[0]}, ${t4[1]}, ${t4[2]}, ${s2.a})`), t3;
      }, toCMYK() {
        const t3 = function(t4, e3, o3) {
          const n3 = f(t4, e3, o3), i3 = n3[0] / 255, s3 = n3[1] / 255, r2 = n3[2] / 255, a2 = u(1 - i3, 1 - s3, 1 - r2);
          return [100 * (1 === a2 ? 0 : (1 - i3 - a2) / (1 - a2)), 100 * (1 === a2 ? 0 : (1 - s3 - a2) / (1 - a2)), 100 * (1 === a2 ? 0 : (1 - r2 - a2) / (1 - a2)), 100 * a2];
        }(s2.h, s2.s, s2.v);
        return t3.toString = i2(t3, (t4) => `cmyk(${t4[0]}%, ${t4[1]}%, ${t4[2]}%, ${t4[3]}%)`), t3;
      }, toHEXA() {
        const t3 = function(t4, e4, o3) {
          return f(t4, e4, o3).map((t5) => m(t5).toString(16).padStart(2, "0"));
        }(s2.h, s2.s, s2.v), e3 = s2.a >= 1 ? "" : Number((255 * s2.a).toFixed(0)).toString(16).toUpperCase().padStart(2, "0");
        return e3 && t3.push(e3), t3.toString = () => `#${t3.join("").toUpperCase()}`, t3;
      }, clone: () => A(s2.h, s2.s, s2.v, s2.a) };
      return s2;
    }
    const $ = (t2) => Math.max(Math.min(t2, 1), 0);
    function C(t2) {
      const e2 = { options: Object.assign({ lock: null, onchange: () => 0, onstop: () => 0 }, t2), _keyboard(t3) {
        const { options: o3 } = e2, { type: n3, key: i2 } = t3;
        if (document.activeElement === o3.wrapper) {
          const { lock: o4 } = e2.options, s2 = "ArrowUp" === i2, r3 = "ArrowRight" === i2, a2 = "ArrowDown" === i2, l2 = "ArrowLeft" === i2;
          if ("keydown" === n3 && (s2 || r3 || a2 || l2)) {
            let n4 = 0, i3 = 0;
            "v" === o4 ? n4 = s2 || r3 ? 1 : -1 : "h" === o4 ? n4 = s2 || r3 ? -1 : 1 : (i3 = s2 ? -1 : a2 ? 1 : 0, n4 = l2 ? -1 : r3 ? 1 : 0), e2.update($(e2.cache.x + 0.01 * n4), $(e2.cache.y + 0.01 * i3)), t3.preventDefault();
          } else
            i2.startsWith("Arrow") && (e2.options.onstop(), t3.preventDefault());
        }
      }, _tapstart(t3) {
        i(document, ["mouseup", "touchend", "touchcancel"], e2._tapstop), i(document, ["mousemove", "touchmove"], e2._tapmove), t3.cancelable && t3.preventDefault(), e2._tapmove(t3);
      }, _tapmove(t3) {
        const { options: o3, cache: n3 } = e2, { lock: i2, element: s2, wrapper: r3 } = o3, a2 = r3.getBoundingClientRect();
        let l2 = 0, c2 = 0;
        if (t3) {
          const e3 = t3 && t3.touches && t3.touches[0];
          l2 = t3 ? (e3 || t3).clientX : 0, c2 = t3 ? (e3 || t3).clientY : 0, l2 < a2.left ? l2 = a2.left : l2 > a2.left + a2.width && (l2 = a2.left + a2.width), c2 < a2.top ? c2 = a2.top : c2 > a2.top + a2.height && (c2 = a2.top + a2.height), l2 -= a2.left, c2 -= a2.top;
        } else
          n3 && (l2 = n3.x * a2.width, c2 = n3.y * a2.height);
        "h" !== i2 && (s2.style.left = `calc(${l2 / a2.width * 100}% - ${s2.offsetWidth / 2}px)`), "v" !== i2 && (s2.style.top = `calc(${c2 / a2.height * 100}% - ${s2.offsetHeight / 2}px)`), e2.cache = { x: l2 / a2.width, y: c2 / a2.height };
        const p3 = $(l2 / a2.width), u2 = $(c2 / a2.height);
        switch (i2) {
          case "v":
            return o3.onchange(p3);
          case "h":
            return o3.onchange(u2);
          default:
            return o3.onchange(p3, u2);
        }
      }, _tapstop() {
        e2.options.onstop(), s(document, ["mouseup", "touchend", "touchcancel"], e2._tapstop), s(document, ["mousemove", "touchmove"], e2._tapmove);
      }, trigger() {
        e2._tapmove();
      }, update(t3 = 0, o3 = 0) {
        const { left: n3, top: i2, width: s2, height: r3 } = e2.options.wrapper.getBoundingClientRect();
        "h" === e2.options.lock && (o3 = t3), e2._tapmove({ clientX: n3 + s2 * t3, clientY: i2 + r3 * o3 });
      }, destroy() {
        const { options: t3, _tapstart: o3, _keyboard: n3 } = e2;
        s(document, ["keydown", "keyup"], n3), s([t3.wrapper, t3.element], "mousedown", o3), s([t3.wrapper, t3.element], "touchstart", o3, { passive: false });
      } }, { options: o2, _tapstart: n2, _keyboard: r2 } = e2;
      return i([o2.wrapper, o2.element], "mousedown", n2), i([o2.wrapper, o2.element], "touchstart", n2, { passive: false }), i(document, ["keydown", "keyup"], r2), e2;
    }
    function k(t2 = {}) {
      t2 = Object.assign({ onchange: () => 0, className: "", elements: [] }, t2);
      const e2 = i(t2.elements, "click", (e3) => {
        t2.elements.forEach((o2) => o2.classList[e3.target === o2 ? "add" : "remove"](t2.className)), t2.onchange(e3), e3.stopPropagation();
      });
      return { destroy: () => s(...e2) };
    }
    const S = { variantFlipOrder: { start: "sme", middle: "mse", end: "ems" }, positionFlipOrder: { top: "tbrl", right: "rltb", bottom: "btrl", left: "lrbt" }, position: "bottom", margin: 8, padding: 0 }, O = (t2, e2, o2) => {
      const n2 = "object" != typeof t2 || t2 instanceof HTMLElement ? { reference: t2, popper: e2, ...o2 } : t2;
      return { update(t3 = n2) {
        const { reference: e3, popper: o3 } = Object.assign(n2, t3);
        if (!o3 || !e3)
          throw new Error("Popper- or reference-element missing.");
        return ((t4, e4, o4) => {
          const { container: n3, arrow: i2, margin: s2, padding: r2, position: a2, variantFlipOrder: l2, positionFlipOrder: c2 } = { container: document.documentElement.getBoundingClientRect(), ...S, ...o4 }, { left: p3, top: u2 } = e4.style;
          e4.style.left = "0", e4.style.top = "0";
          const h3 = t4.getBoundingClientRect(), d2 = e4.getBoundingClientRect(), m2 = { t: h3.top - d2.height - s2, b: h3.bottom + s2, r: h3.right + s2, l: h3.left - d2.width - s2 }, f2 = { vs: h3.left, vm: h3.left + h3.width / 2 - d2.width / 2, ve: h3.left + h3.width - d2.width, hs: h3.top, hm: h3.bottom - h3.height / 2 - d2.height / 2, he: h3.bottom - d2.height }, [v2, b2 = "middle"] = a2.split("-"), y2 = c2[v2], g2 = l2[b2], { top: _2, left: w2, bottom: A2, right: $2 } = n3;
          for (const t5 of y2) {
            const o5 = "t" === t5 || "b" === t5;
            let n4 = m2[t5];
            const [s3, a3] = o5 ? ["top", "left"] : ["left", "top"], [l3, c3] = o5 ? [d2.height, d2.width] : [d2.width, d2.height], [p4, u3] = o5 ? [A2, $2] : [$2, A2], [v3, b3] = o5 ? [_2, w2] : [w2, _2];
            if (!(n4 < v3 || n4 + l3 + r2 > p4))
              for (const p5 of g2) {
                let m3 = f2[(o5 ? "v" : "h") + p5];
                if (!(m3 < b3 || m3 + c3 + r2 > u3)) {
                  if (m3 -= d2[a3], n4 -= d2[s3], e4.style[a3] = `${m3}px`, e4.style[s3] = `${n4}px`, i2) {
                    const e5 = o5 ? h3.width / 2 : h3.height / 2, r3 = c3 / 2, u4 = e5 > r3, d3 = m3 + { s: u4 ? r3 : e5, m: r3, e: u4 ? r3 : c3 - e5 }[p5], f3 = n4 + { t: l3, b: 0, r: 0, l: l3 }[t5];
                    i2.style[a3] = `${d3}px`, i2.style[s3] = `${f3}px`;
                  }
                  return t5 + p5;
                }
              }
          }
          return e4.style.left = p3, e4.style.top = u2, null;
        })(e3, o3, n2);
      } };
    };
    const _E = class {
      constructor(t2) {
        __publicField(this, "_initializingActive", true);
        __publicField(this, "_recalc", true);
        __publicField(this, "_nanopop", null);
        __publicField(this, "_root", null);
        __publicField(this, "_color", A());
        __publicField(this, "_lastColor", A());
        __publicField(this, "_swatchColors", []);
        __publicField(this, "_setupAnimationFrame", null);
        __publicField(this, "_eventListener", { init: [], save: [], hide: [], show: [], clear: [], change: [], changestop: [], cancel: [], swatchselect: [] });
        this.options = t2 = Object.assign({ ..._E.DEFAULT_OPTIONS }, t2);
        const { swatches: e2, components: o2, theme: n2, sliders: i2, lockOpacity: s2, padding: r2 } = t2;
        ["nano", "monolith"].includes(n2) && !i2 && (t2.sliders = "h"), o2.interaction || (o2.interaction = {});
        const { preview: a2, opacity: l2, hue: c2, palette: p3 } = o2;
        o2.opacity = !s2 && l2, o2.palette = p3 || a2 || l2 || c2, this._preBuild(), this._buildComponents(), this._bindEvents(), this._finalBuild(), e2 && e2.length && e2.forEach((t3) => this.addSwatch(t3));
        const { button: u2, app: h3 } = this._root;
        this._nanopop = O(u2, h3, { margin: r2 }), u2.setAttribute("role", "button"), u2.setAttribute("aria-label", this._t("btn:toggle"));
        const d2 = this;
        this._setupAnimationFrame = requestAnimationFrame(function e3() {
          if (!h3.offsetWidth)
            return requestAnimationFrame(e3);
          d2.setColor(t2.default), d2._rePositioningPicker(), t2.defaultRepresentation && (d2._representation = t2.defaultRepresentation, d2.setColorRepresentation(d2._representation)), t2.showAlways && d2.show(), d2._initializingActive = false, d2._emit("init");
        });
      }
      _preBuild() {
        const { options: t2 } = this;
        for (const e2 of ["el", "container"])
          t2[e2] = c(t2[e2]);
        this._root = ((t3) => {
          const { components: e2, useAsButton: o2, inline: n2, appClass: i2, theme: s2, lockOpacity: r2 } = t3.options, l2 = (t4) => t4 ? "" : 'style="display:none" hidden', c2 = (e3) => t3._t(e3), p3 = a(`
      <div :ref="root" class="pickr">

        ${o2 ? "" : '<button type="button" :ref="button" class="pcr-button"></button>'}

        <div :ref="app" class="pcr-app ${i2 || ""}" data-theme="${s2}" ${n2 ? 'style="position: unset"' : ""} aria-label="${c2("ui:dialog")}" role="window">
          <div class="pcr-selection" ${l2(e2.palette)}>
            <div :obj="preview" class="pcr-color-preview" ${l2(e2.preview)}>
              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${c2("btn:last-color")}"></button>
              <div :ref="currentColor" class="pcr-current-color"></div>
            </div>

            <div :obj="palette" class="pcr-color-palette">
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${c2("aria:palette")}" role="listbox"></div>
            </div>

            <div :obj="hue" class="pcr-color-chooser" ${l2(e2.hue)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${c2("aria:hue")}" role="slider"></div>
            </div>

            <div :obj="opacity" class="pcr-color-opacity" ${l2(e2.opacity)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${c2("aria:opacity")}" role="slider"></div>
            </div>
          </div>

          <div class="pcr-swatches ${e2.palette ? "" : "pcr-last"}" :ref="swatches"></div>

          <div :obj="interaction" class="pcr-interaction" ${l2(Object.keys(e2.interaction).length)}>
            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${l2(e2.interaction.input)} aria-label="${c2("aria:input")}">

            <input :arr="options" class="pcr-type" data-type="HEXA" value="${r2 ? "HEX" : "HEXA"}" type="button" ${l2(e2.interaction.hex)}>
            <input :arr="options" class="pcr-type" data-type="RGBA" value="${r2 ? "RGB" : "RGBA"}" type="button" ${l2(e2.interaction.rgba)}>
            <input :arr="options" class="pcr-type" data-type="HSLA" value="${r2 ? "HSL" : "HSLA"}" type="button" ${l2(e2.interaction.hsla)}>
            <input :arr="options" class="pcr-type" data-type="HSVA" value="${r2 ? "HSV" : "HSVA"}" type="button" ${l2(e2.interaction.hsva)}>
            <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${l2(e2.interaction.cmyk)}>

            <input :ref="save" class="pcr-save" value="${c2("btn:save")}" type="button" ${l2(e2.interaction.save)} aria-label="${c2("aria:btn:save")}">
            <input :ref="cancel" class="pcr-cancel" value="${c2("btn:cancel")}" type="button" ${l2(e2.interaction.cancel)} aria-label="${c2("aria:btn:cancel")}">
            <input :ref="clear" class="pcr-clear" value="${c2("btn:clear")}" type="button" ${l2(e2.interaction.clear)} aria-label="${c2("aria:btn:clear")}">
          </div>
        </div>
      </div>
    `), u2 = p3.interaction;
          return u2.options.find((t4) => !t4.hidden && !t4.classList.add("active")), u2.type = () => u2.options.find((t4) => t4.classList.contains("active")), p3;
        })(this), t2.useAsButton && (this._root.button = t2.el), t2.container.appendChild(this._root.root);
      }
      _finalBuild() {
        const t2 = this.options, e2 = this._root;
        if (t2.container.removeChild(e2.root), t2.inline) {
          const o2 = t2.el.parentElement;
          t2.el.nextSibling ? o2.insertBefore(e2.app, t2.el.nextSibling) : o2.appendChild(e2.app);
        } else
          t2.container.appendChild(e2.app);
        t2.useAsButton ? t2.inline && t2.el.remove() : t2.el.parentNode.replaceChild(e2.root, t2.el), t2.disabled && this.disable(), t2.comparison || (e2.button.style.transition = "none", t2.useAsButton || (e2.preview.lastColor.style.transition = "none")), this.hide();
      }
      _buildComponents() {
        const t2 = this, e2 = this.options.components, o2 = (t2.options.sliders || "v").repeat(2), [n2, i2] = o2.match(/^[vh]+$/g) ? o2 : [], s2 = () => this._color || (this._color = this._lastColor.clone()), r2 = { palette: C({ element: t2._root.palette.picker, wrapper: t2._root.palette.palette, onstop: () => t2._emit("changestop", "slider", t2), onchange(o3, n3) {
          if (!e2.palette)
            return;
          const i3 = s2(), { _root: r3, options: a2 } = t2, { lastColor: l2, currentColor: c2 } = r3.preview;
          t2._recalc && (i3.s = 100 * o3, i3.v = 100 - 100 * n3, i3.v < 0 && (i3.v = 0), t2._updateOutput("slider"));
          const p3 = i3.toRGBA().toString(0);
          this.element.style.background = p3, this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${i3.a}), transparent),
                        linear-gradient(to left, hsla(${i3.h}, 100%, 50%, ${i3.a}), rgba(255, 255, 255, ${i3.a}))
                    `, a2.comparison ? a2.useAsButton || t2._lastColor || l2.style.setProperty("--pcr-color", p3) : (r3.button.style.setProperty("--pcr-color", p3), r3.button.classList.remove("clear"));
          const u2 = i3.toHEXA().toString();
          for (const { el: e3, color: o4 } of t2._swatchColors)
            e3.classList[u2 === o4.toHEXA().toString() ? "add" : "remove"]("pcr-active");
          c2.style.setProperty("--pcr-color", p3);
        } }), hue: C({ lock: "v" === i2 ? "h" : "v", element: t2._root.hue.picker, wrapper: t2._root.hue.slider, onstop: () => t2._emit("changestop", "slider", t2), onchange(o3) {
          if (!e2.hue || !e2.palette)
            return;
          const n3 = s2();
          t2._recalc && (n3.h = 360 * o3), this.element.style.backgroundColor = `hsl(${n3.h}, 100%, 50%)`, r2.palette.trigger();
        } }), opacity: C({ lock: "v" === n2 ? "h" : "v", element: t2._root.opacity.picker, wrapper: t2._root.opacity.slider, onstop: () => t2._emit("changestop", "slider", t2), onchange(o3) {
          if (!e2.opacity || !e2.palette)
            return;
          const n3 = s2();
          t2._recalc && (n3.a = Math.round(100 * o3) / 100), this.element.style.background = `rgba(0, 0, 0, ${n3.a})`, r2.palette.trigger();
        } }), selectable: k({ elements: t2._root.interaction.options, className: "active", onchange(e3) {
          t2._representation = e3.target.getAttribute("data-type").toUpperCase(), t2._recalc && t2._updateOutput("swatch");
        } }) };
        this._components = r2;
      }
      _bindEvents() {
        const { _root: t2, options: e2 } = this, o2 = [i(t2.interaction.clear, "click", () => this._clearColor()), i([t2.interaction.cancel, t2.preview.lastColor], "click", () => {
          this.setHSVA(...(this._lastColor || this._color).toHSVA(), true), this._emit("cancel");
        }), i(t2.interaction.save, "click", () => {
          !this.applyColor() && !e2.showAlways && this.hide();
        }), i(t2.interaction.result, ["keyup", "input"], (t3) => {
          this.setColor(t3.target.value, true) && !this._initializingActive && (this._emit("change", this._color, "input", this), this._emit("changestop", "input", this)), t3.stopImmediatePropagation();
        }), i(t2.interaction.result, ["focus", "blur"], (t3) => {
          this._recalc = "blur" === t3.type, this._recalc && this._updateOutput(null);
        }), i([t2.palette.palette, t2.palette.picker, t2.hue.slider, t2.hue.picker, t2.opacity.slider, t2.opacity.picker], ["mousedown", "touchstart"], () => this._recalc = true, { passive: true })];
        if (!e2.showAlways) {
          const n2 = e2.closeWithKey;
          o2.push(i(t2.button, "click", () => this.isOpen() ? this.hide() : this.show()), i(document, "keyup", (t3) => this.isOpen() && (t3.key === n2 || t3.code === n2) && this.hide()), i(document, ["touchstart", "mousedown"], (e3) => {
            this.isOpen() && !l(e3).some((e4) => e4 === t2.app || e4 === t2.button) && this.hide();
          }, { capture: true }));
        }
        if (e2.adjustableNumbers) {
          const e3 = { rgba: [255, 255, 255, 1], hsva: [360, 100, 100, 1], hsla: [360, 100, 100, 1], cmyk: [100, 100, 100, 100] };
          p2(t2.interaction.result, (t3, o3, n2) => {
            const i2 = e3[this.getColorRepresentation().toLowerCase()];
            if (i2) {
              const e4 = i2[n2], s2 = t3 + (e4 >= 100 ? 1e3 * o3 : o3);
              return s2 <= 0 ? 0 : Number((s2 < e4 ? s2 : e4).toPrecision(3));
            }
            return t3;
          });
        }
        if (e2.autoReposition && !e2.inline) {
          let t3 = null;
          const n2 = this;
          o2.push(i(window, ["scroll", "resize"], () => {
            n2.isOpen() && (e2.closeOnScroll && n2.hide(), null === t3 ? (t3 = setTimeout(() => t3 = null, 100), requestAnimationFrame(function e3() {
              n2._rePositioningPicker(), null !== t3 && requestAnimationFrame(e3);
            })) : (clearTimeout(t3), t3 = setTimeout(() => t3 = null, 100)));
          }, { capture: true }));
        }
        this._eventBindings = o2;
      }
      _rePositioningPicker() {
        const { options: t2 } = this;
        if (!t2.inline) {
          if (!this._nanopop.update({ container: document.body.getBoundingClientRect(), position: t2.position })) {
            const t3 = this._root.app, e2 = t3.getBoundingClientRect();
            t3.style.top = (window.innerHeight - e2.height) / 2 + "px", t3.style.left = (window.innerWidth - e2.width) / 2 + "px";
          }
        }
      }
      _updateOutput(t2) {
        const { _root: e2, _color: o2, options: n2 } = this;
        if (e2.interaction.type()) {
          const t3 = `to${e2.interaction.type().getAttribute("data-type")}`;
          e2.interaction.result.value = "function" == typeof o2[t3] ? o2[t3]().toString(n2.outputPrecision) : "";
        }
        !this._initializingActive && this._recalc && this._emit("change", o2, t2, this);
      }
      _clearColor(t2 = false) {
        const { _root: e2, options: o2 } = this;
        o2.useAsButton || e2.button.style.setProperty("--pcr-color", "rgba(0, 0, 0, 0.15)"), e2.button.classList.add("clear"), o2.showAlways || this.hide(), this._lastColor = null, this._initializingActive || t2 || (this._emit("save", null), this._emit("clear"));
      }
      _parseLocalColor(t2) {
        const { values: e2, type: o2, a: n2 } = w(t2), { lockOpacity: i2 } = this.options, s2 = void 0 !== n2 && 1 !== n2;
        return e2 && 3 === e2.length && (e2[3] = void 0), { values: !e2 || i2 && s2 ? null : e2, type: o2 };
      }
      _t(t2) {
        return this.options.i18n[t2] || _E.I18N_DEFAULTS[t2];
      }
      _emit(t2, ...e2) {
        this._eventListener[t2].forEach((t3) => t3(...e2, this));
      }
      on(t2, e2) {
        return this._eventListener[t2].push(e2), this;
      }
      off(t2, e2) {
        const o2 = this._eventListener[t2] || [], n2 = o2.indexOf(e2);
        return ~n2 && o2.splice(n2, 1), this;
      }
      addSwatch(t2) {
        const { values: e2 } = this._parseLocalColor(t2);
        if (e2) {
          const { _swatchColors: t3, _root: o2 } = this, n2 = A(...e2), s2 = r(`<button type="button" style="--pcr-color: ${n2.toRGBA().toString(0)}" aria-label="${this._t("btn:swatch")}"/>`);
          return o2.swatches.appendChild(s2), t3.push({ el: s2, color: n2 }), this._eventBindings.push(i(s2, "click", () => {
            this.setHSVA(...n2.toHSVA(), true), this._emit("swatchselect", n2), this._emit("change", n2, "swatch", this);
          })), true;
        }
        return false;
      }
      removeSwatch(t2) {
        const e2 = this._swatchColors[t2];
        if (e2) {
          const { el: o2 } = e2;
          return this._root.swatches.removeChild(o2), this._swatchColors.splice(t2, 1), true;
        }
        return false;
      }
      applyColor(t2 = false) {
        const { preview: e2, button: o2 } = this._root, n2 = this._color.toRGBA().toString(0);
        return e2.lastColor.style.setProperty("--pcr-color", n2), this.options.useAsButton || o2.style.setProperty("--pcr-color", n2), o2.classList.remove("clear"), this._lastColor = this._color.clone(), this._initializingActive || t2 || this._emit("save", this._color), this;
      }
      destroy() {
        cancelAnimationFrame(this._setupAnimationFrame), this._eventBindings.forEach((t2) => s(...t2)), Object.keys(this._components).forEach((t2) => this._components[t2].destroy());
      }
      destroyAndRemove() {
        this.destroy();
        const { root: t2, app: e2 } = this._root;
        t2.parentElement && t2.parentElement.removeChild(t2), e2.parentElement.removeChild(e2), Object.keys(this).forEach((t3) => this[t3] = null);
      }
      hide() {
        return !!this.isOpen() && (this._root.app.classList.remove("visible"), this._emit("hide"), true);
      }
      show() {
        return !this.options.disabled && !this.isOpen() && (this._root.app.classList.add("visible"), this._rePositioningPicker(), this._emit("show", this._color), this);
      }
      isOpen() {
        return this._root.app.classList.contains("visible");
      }
      setHSVA(t2 = 360, e2 = 0, o2 = 0, n2 = 1, i2 = false) {
        const s2 = this._recalc;
        if (this._recalc = false, t2 < 0 || t2 > 360 || e2 < 0 || e2 > 100 || o2 < 0 || o2 > 100 || n2 < 0 || n2 > 1)
          return false;
        this._color = A(t2, e2, o2, n2);
        const { hue: r2, opacity: a2, palette: l2 } = this._components;
        return r2.update(t2 / 360), a2.update(n2), l2.update(e2 / 100, 1 - o2 / 100), i2 || this.applyColor(), s2 && this._updateOutput(), this._recalc = s2, true;
      }
      setColor(t2, e2 = false) {
        if (null === t2)
          return this._clearColor(e2), true;
        const { values: o2, type: n2 } = this._parseLocalColor(t2);
        if (o2) {
          const t3 = n2.toUpperCase(), { options: i2 } = this._root.interaction, s2 = i2.find((e3) => e3.getAttribute("data-type") === t3);
          if (s2 && !s2.hidden)
            for (const t4 of i2)
              t4.classList[t4 === s2 ? "add" : "remove"]("active");
          return !!this.setHSVA(...o2, e2) && this.setColorRepresentation(t3);
        }
        return false;
      }
      setColorRepresentation(t2) {
        return t2 = t2.toUpperCase(), !!this._root.interaction.options.find((e2) => e2.getAttribute("data-type").startsWith(t2) && !e2.click());
      }
      getColorRepresentation() {
        return this._representation;
      }
      getColor() {
        return this._color;
      }
      getSelectedColor() {
        return this._lastColor;
      }
      getRoot() {
        return this._root;
      }
      disable() {
        return this.hide(), this.options.disabled = true, this._root.button.classList.add("disabled"), this;
      }
      enable() {
        return this.options.disabled = false, this._root.button.classList.remove("disabled"), this;
      }
    };
    let E = _E;
    __publicField(E, "utils", o);
    __publicField(E, "version", "1.9.1");
    __publicField(E, "I18N_DEFAULTS", { "ui:dialog": "color picker dialog", "btn:toggle": "toggle color picker dialog", "btn:swatch": "color swatch", "btn:last-color": "use previous color", "btn:save": "Save", "btn:cancel": "Cancel", "btn:clear": "Clear", "aria:btn:save": "save and close", "aria:btn:cancel": "cancel and close", "aria:btn:clear": "clear and close", "aria:input": "color input field", "aria:palette": "color selection area", "aria:hue": "hue selection slider", "aria:opacity": "selection slider" });
    __publicField(E, "DEFAULT_OPTIONS", { appClass: null, theme: "classic", useAsButton: false, padding: 8, disabled: false, comparison: true, closeOnScroll: false, outputPrecision: 0, lockOpacity: false, autoReposition: true, container: "body", components: { interaction: {} }, i18n: {}, swatches: null, inline: false, sliders: null, default: "#42445a", defaultRepresentation: null, position: "bottom-middle", adjustableNumbers: true, showAlways: false, closeWithKey: "Escape" });
    __publicField(E, "create", (t2) => new _E(t2));
    return e = e.default;
  })());
})(pickr_min);
var Pickr = /* @__PURE__ */ getDefaultExportFromCjs(pickr_min.exports);
var nano_min = "";
class ColorPickr {
  constructor({
    swatches = [],
    defaultColor,
    event: {
      onShow = null,
      onHide = null,
      onChange = null,
      onSave = null
    } = {}
  }) {
    this.pickr = Pickr.create({
      el: ".color-picker-btn",
      theme: "nano",
      default: defaultColor,
      swatches,
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          save: true,
          cancel: true
        }
      },
      i18n: {
        "btn:save": "\u52A0\u5230\u5E38\u7528",
        "btn:cancel": "\u6E05\u9664\u5E38\u7528"
      }
    });
    if (onShow && typeof onShow == "function")
      this.pickr.on("show", onShow);
    if (onHide && typeof onHide == "function")
      this.pickr.on("hide", onHide);
    if (onChange && typeof onChange == "function")
      this.pickr.on("change", onChange);
    if (onSave && typeof onSave == "function")
      this.pickr.on("change", onSave);
  }
  setColor(color2) {
    this.pickr.setColor(color2);
  }
  getColor() {
    return `#${this.pickr.getColor().toHEXA().join("").toString()}`;
  }
  hide() {
    this.pickr.hide();
  }
  getSwatches() {
    return this.pickr._swatchColors.reduce((arr, swatch) => {
      arr.push(swatch.color.toHEXA().toString());
      return arr;
    }, []);
  }
  addSwatch(color2) {
    if (!this.getSwatches().includes(color2.toUpperCase())) {
      this.pickr.addSwatch(color2);
    }
  }
  removeSwatch(index2) {
    this.pickr.removeSwatch(index2);
  }
}
let UserSetting$1, Data$1;
let UserSettingValue$1, DataValue$1;
async function initEventListener() {
  UserSetting$1 = await initUserSetting();
  UserSettingValue$1 = await UserSetting$1.get();
  Data$1 = await initData();
  DataValue$1 = await Data$1.get();
  const Nav = document.querySelector("nav");
  const MenuCircleBtn = document.querySelector(".menu-circle-button");
  const SlideMenu = document.querySelector("#slideMenu");
  const NavButton = document.querySelector(".nav-button");
  const InputModal = document.querySelector("#inputModal");
  const GoalDetailModal = document.querySelector("#goalDetailModal");
  const AccountingModal = document.querySelector("#accountingModal");
  const PickrModal = document.querySelector("#pickrModal");
  new bootstrap.Offcanvas(SlideMenu);
  const InputModal_bs = new bootstrap.Modal(InputModal);
  const GoalDetailModal_bs = new bootstrap.Modal(GoalDetailModal);
  const AccountingModal_bs = new bootstrap.Modal(AccountingModal);
  const PickrModal_bs = new bootstrap.Modal(PickrModal);
  const ButtonChangeMode = document.querySelector("#btn-change-mode");
  const ItemMainNav = document.querySelector("#item-main-nav");
  const CarouselControl = document.querySelector("#carouselData");
  const CarouselAccountingControl = document.querySelector("#carouselAccountingNameData");
  document.querySelector("#home");
  const HomeContent = document.querySelector("#home-content");
  const AccountingDetail = document.querySelector("#accountingDetail");
  const AccountingDetailContent = document.querySelector("#accountingDetail-content");
  const SettingContent = document.querySelector("#setting-content");
  const OpenAccountingModal = document.querySelectorAll(".open-accountingModal");
  let HomeContentPressTimer;
  let startX, startY;
  let isLongPress = false;
  let DropdownTrigger;
  let Pickr2 = "";
  function backState(device = null) {
    const states2 = get();
    if (states2.length == 0) {
      if (device == "mobile") {
        App.exitApp();
      }
    } else {
      let state = states2[states2.length - 1];
      if (state.type == "bs.modal") {
        state.instance.hide();
      }
      if (state.type == "swal") {
        state.instance.close();
      }
      if (state.type == "tab") {
        state.callback();
      }
    }
  }
  App.addListener("backButton", (e) => {
    backState("mobile");
  });
  document.addEventListener("show.bs.modal", (e) => {
    const modal = e.target;
    push({
      name: modal.id,
      instance: bootstrap.Modal.getInstance(modal),
      type: "bs.modal"
    });
  });
  document.addEventListener("hide.bs.modal", (e) => {
    const modal = e.target;
    remove(modal.id);
  });
  document.addEventListener("keyup", (e) => {
    if (e.key == "F4") {
      backState();
    }
  });
  Nav.addEventListener("click", async (e) => {
    resetStatus();
    clean();
    const target = e.target;
    const selectedNavLink = target.closest(".nav-link");
    if (!selectedNavLink)
      return;
    const selectedTabTarget = selectedNavLink.dataset.tabTarget;
    if (Nav.dataset.active == selectedTabTarget)
      return;
    const selectedTab = document.querySelector(selectedTabTarget);
    const lastActiveLink = Nav.querySelector(".nav-link.active");
    const lastTab = document.querySelector(lastActiveLink.dataset.tabTarget);
    const navLinks = Nav.querySelectorAll(".nav-link");
    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
    });
    selectedNavLink.classList.add("active");
    let outDirection, inDirection;
    if (selectedNavLink.dataset.order < lastActiveLink.dataset.order) {
      outDirection = "right";
      inDirection = "left";
    } else {
      outDirection = "left";
      inDirection = "right";
    }
    lastTab.classList.add(`slide-out-${outDirection}`);
    selectedTab.classList.add(`slide-in-${inDirection}`);
    selectedTab.classList.add("active");
    Nav.dataset.active = selectedTabTarget;
    setTimeout(() => {
      lastTab.classList.remove("active", `slide-out-${outDirection}`);
      selectedTab.classList.remove(`slide-in-${inDirection}`);
    }, 50);
    if (selectedTabTarget == "#home" || selectedTabTarget == "#accountingDetail")
      MenuCircleBtn.classList.remove("d-none");
    else
      MenuCircleBtn.classList.add("d-none");
    if (selectedTabTarget == "#export") {
      await showAlert({
        title: "todo",
        icon: "error"
      });
      lastActiveLink.click();
    }
  });
  MenuCircleBtn.addEventListener("click", (e) => {
    const activeTab = Nav.dataset.active;
    if (activeTab == "#home")
      switchBsModalDisplay(InputModal_bs);
    if (activeTab == "#accountingDetail")
      switchBsModalDisplay(AccountingModal_bs);
    function switchBsModalDisplay(bsModal) {
      if (bsModal._isShown)
        bsModal.hide();
      else
        bsModal.show();
    }
  });
  Pickr2 = new ColorPickr({
    swatches: UserSettingValue$1.Pickr.Swatches,
    defaultColor: getRandomLightColor(),
    event: {
      onShow: () => {
        PickrModal_bs.show();
      },
      onHide: () => {
        PickrModal_bs.hide();
      },
      onChange: (c) => {
        const color2 = `#${c.toHEXA().join("").toString()}`;
        const btn = document.querySelector(".pcr-button");
        Pickr2.setColor(color2);
        btn.style.setProperty("--pcr-color", color2);
      }
    }
  });
  document.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("pcr-save")) {
      Pickr2.addSwatch(Pickr2.getColor());
      UserSettingValue$1.Pickr.Swatches.push(Pickr2.getColor());
      await UserSetting$1.set(UserSettingValue$1);
    }
    if (target.classList.contains("pcr-cancel")) {
      const index2 = Pickr2.getSwatches().indexOf(Pickr2.getColor().toUpperCase());
      if (index2 > -1) {
        Pickr2.removeSwatch(index2);
        UserSettingValue$1.Pickr.Swatches.splice(index2, 1);
        await UserSetting$1.set(UserSettingValue$1);
      }
    }
  });
  PickrModal.addEventListener("hide.bs.modal", (e) => {
    Pickr2.hide();
  });
  NavButton == null ? void 0 : NavButton.addEventListener("click", (e) => {
    itemSelectedMode("close");
  });
  InputModal.addEventListener("show.bs.modal", () => {
    const label = InputModal.querySelector("#label-set-total-target");
    const checkbox = InputModal.querySelector("#chk-set-total-target");
    if (DataValue$1[UserSettingValue$1.CurrentDateKey]["totalGoal"]["goal"]) {
      label.textContent = "\u672C\u6708\u5DF2\u8A2D\u5B9A\u7E3D\u76EE\u6A19";
      checkbox.disabled = true;
      checkbox.checked = true;
    } else {
      label.textContent = "\u8A2D\u70BA\u672C\u6708\u7E3D\u76EE\u6A19";
      checkbox.disabled = false;
      checkbox.checked = false;
    }
    Pickr2.setColor(getRandomLightColor());
  });
  InputModal.addEventListener("click", async (element) => {
    var _a, _b;
    const target = element.target;
    const inputs = InputModal.querySelectorAll("input");
    const keyName = inputs[0].value;
    switch ((_a = target.dataset) == null ? void 0 : _a.action) {
      case "copy":
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let previousYear = year;
        let previousMonth = month - 1;
        if (previousMonth === 0) {
          previousYear = year - 1;
          previousMonth = 12;
        }
        month = month < 10 ? "0" + month : month;
        previousMonth = previousMonth < 10 ? "0" + previousMonth : previousMonth.toString();
        let thisDate = `${year}-${month}`;
        let previousDate = `${previousYear}-${previousMonth}`;
        if (!((_b = DataValue$1[previousDate]) == null ? void 0 : _b.items)) {
          showAlert({
            title: "\u5C1A\u7121\u4EFB\u4F55\u76EE\u6A19\uFF0C\u8ACB\u5148\u65B0\u589E\u904E\u4E00\u6B21\u76EE\u6A19",
            icon: "error"
          });
          return;
        }
        if (DataValue$1[thisDate]["items"].length > 0) {
          showAlert({
            title: `\u78BA\u5B9A\u8981\u8907\u88FD${previousDate}\u7684\u76EE\u6A19\u55CE\uFF1F\u9019\u5C07\u6703\u8907\u5BEB\u9019\u500B\u6708\u5DF2\u8A2D\u5B9A\u7684\u76EE\u6A19`,
            icon: "warning",
            showCancelButton: true
          }, async (confirm2) => {
            if (confirm2.isConfirmed) {
              await copyPreviousGoal();
            }
          });
        } else {
          await copyPreviousGoal();
        }
        async function copyPreviousGoal() {
          DataValue$1[thisDate] = JSON.parse(JSON.stringify(DataValue$1[previousDate]));
          await Data$1.set(DataValue$1);
          showAlert({
            title: "\u5DF2\u8907\u88FD\u4E0A\u6B21\u7684\u76EE\u6A19",
            icon: "success",
            timer: 1500
          });
          renderDataContent(DataValue$1, UserSettingValue$1);
          InputModal_bs.hide();
        }
        break;
      case "insert-next":
      case "insert":
        if (check(keyName)) {
          const label = InputModal.querySelector("#label-set-total-target");
          const checkbox = InputModal.querySelector("#chk-set-total-target");
          if (!checkbox.disabled && checkbox.checked) {
            showAlert({
              title: "\u78BA\u5B9A\u8981\u65B0\u589E\u70BA\u672C\u6708\u7E3D\u76EE\u6A19\uFF1F",
              icon: "question",
              showCancelButton: true
            }, async (confirm2) => {
              if (confirm2.isConfirmed) {
                label.textContent = "\u672C\u6708\u5DF2\u8A2D\u5B9A\u7E3D\u76EE\u6A19";
                checkbox.disabled = true;
                DataValue$1[UserSettingValue$1.CurrentDateKey]["totalGoal"]["name"] = keyName;
                DataValue$1[UserSettingValue$1.CurrentDateKey]["totalGoal"]["goal"] = {
                  amount: Number(inputs[1].value),
                  bonus: Number(inputs[2].value)
                };
                await Data$1.set(DataValue$1);
                showAlert({
                  title: "\u5DF2\u65B0\u589E\u70BA\u672C\u6708\u7E3D\u76EE\u6A19",
                  icon: "success"
                });
                afterInsert(inputs, target.dataset.action);
              }
            });
          } else {
            const newItem = {
              name: keyName,
              goal: {
                amount: Number(inputs[1].value),
                bonus: Number(inputs[2].value)
              },
              current: {
                amount: 0,
                bonus: 0
              },
              accounting: [],
              color: Pickr2.getColor(),
              create_at: getCurrentFormattedDateTime()
            };
            if (UserSettingValue$1.NewItemPosition == "top")
              DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].unshift(newItem);
            else
              DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].push(newItem);
            await Data$1.set(DataValue$1);
            afterInsert(inputs, target.dataset.action);
            await refreshAccountings();
          }
        }
        break;
      case "close":
        reset();
        break;
    }
    function check(key) {
      if (checkInput() && checkKeyDuplicate(key))
        return true;
      else
        return false;
      function checkInput() {
        const form = InputModal.querySelector("form");
        if (form.checkValidity() === false)
          form.classList.add("was-validated");
        else
          return true;
        return false;
      }
      function checkKeyDuplicate(keyName2) {
        const datas = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"];
        if (datas.some((item) => item.name === keyName2) || keyName2 == "\u7E3D\u89BD" || keyName2 == "\u5176\u4ED6\u82B1\u8CBB") {
          const firstInput = InputModal.querySelector("form input[name='input-name']");
          showAlert({
            title: "\u76EE\u6A19\u540D\u7A31\u91CD\u8907",
            icon: "error"
          }, () => {
            firstInput.value = "";
            firstInput.focus();
            firstInput.classList.add("is-invalid");
          });
          return false;
        } else
          return true;
      }
    }
    function afterInsert(inputs2, action) {
      renderDataContent(DataValue$1, UserSettingValue$1);
      inputs2.forEach((input) => {
        input.value = "";
      });
      reset();
      if (action == "insert") {
        InputModal_bs.hide();
      }
    }
    function reset() {
      const form = InputModal.querySelector("form");
      const inputs2 = form.querySelectorAll("form input[type='text'][type='name']");
      const checkboxs = InputModal.querySelectorAll("input[type='checkbox']");
      form.classList.remove("was-validated");
      inputs2.forEach((e) => {
        e.classList.remove("is-invalid");
      });
      checkboxs.forEach((e) => {
        if (!DataValue$1[UserSettingValue$1.CurrentDateKey]["goal"])
          e.checked = false;
      });
    }
  });
  ButtonChangeMode == null ? void 0 : ButtonChangeMode.addEventListener("change", (e) => {
    e.target;
    let text;
    switch (UserSettingValue$1.Mode) {
      case "t-mode":
        text = "\u500B\u5225\u6A21\u5F0F";
        UserSettingValue$1.Mode = "it-mode";
        break;
      case "it-mode":
        text = "\u7E3D\u984D\u6A21\u5F0F";
        UserSettingValue$1.Mode = "t-mode";
        break;
    }
    document.querySelector("label[for='btn-change-mode']").textContent = text;
    UserSetting$1.set(UserSettingValue$1);
    resetStatus();
    renderDataContent(DataValue$1, UserSettingValue$1);
  });
  CarouselControl.addEventListener("click", async (e) => {
    const control = e.target.closest("button.carousel-control");
    if (!control)
      return;
    let date = "";
    if (control.classList.contains("carousel-control-prev")) {
      date = getOffsetMonth(UserSettingValue$1.CurrentDateKey, -1);
    }
    if (control.classList.contains("carousel-control-next")) {
      date = getOffsetMonth(UserSettingValue$1.CurrentDateKey, 1);
    }
    if (!(date in DataValue$1)) {
      DataValue$1[date] = Data$1.getDefault(date)[date];
      await Data$1.set(DataValue$1);
    }
    UserSettingValue$1.CurrentDateKey = date;
    let accountings = DataValue$1[UserSettingValue$1.CurrentDateKey].items.normal.map((item) => item.name);
    accountings.unshift("\u7E3D\u89BD");
    accountings.push("\u5176\u4ED6\u82B1\u8CBB");
    UserSettingValue$1.CurrentAccountingIndex = 0;
    UserSettingValue$1.CurrentAccountings = accountings;
    const accountingTarget = UserSettingValue$1.CurrentAccountings[0];
    await UserSetting$1.set(UserSettingValue$1);
    renderDataContent(DataValue$1, UserSettingValue$1);
    renderCarouselData(UserSettingValue$1.CurrentDateKey);
    renderCarouselAccountingData(accountingTarget);
    renderAccountingDetail(DataValue$1[UserSettingValue$1.CurrentDateKey]["items"], accountingTarget);
  });
  CarouselAccountingControl.addEventListener("click", async (e) => {
    const control = e.target.closest("button.carousel-control");
    if (!control)
      return;
    let current_index = UserSettingValue$1.CurrentAccountingIndex;
    if (control.classList.contains("carousel-control-prev")) {
      if (current_index == 0)
        current_index = UserSettingValue$1.CurrentAccountings.length - 1;
      else
        current_index--;
    }
    if (control.classList.contains("carousel-control-next")) {
      if (current_index >= UserSettingValue$1.CurrentAccountings.length - 1)
        current_index = 0;
      else
        current_index++;
    }
    await toggleAccounting(current_index);
  });
  GoalDetailModal.addEventListener("click", async (e) => {
    var _a;
    const target = e.target;
    if (!target.dataset.action)
      return;
    const parent = target.closest(".modal-content");
    const span = parent.querySelector(".modal-title-span");
    const input = parent.querySelector(".modal-title-input");
    switch ((_a = target.dataset) == null ? void 0 : _a.action) {
      case "rename":
        span.classList.add("d-none");
        input.classList.remove("d-none");
        parent.querySelector(".bi-pencil-square").classList.add("d-none");
        parent.querySelector(".bi-check-square").classList.remove("d-none");
        parent.querySelector(".modal-title-input").focus();
        break;
      case "rename-confirm":
        const oldText = span.textContent;
        const newText = input.textContent;
        const datas = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"];
        if (oldText !== newText && (datas.some((item) => item.name === newText) || newText == "\u7E3D\u89BD" || newText == "\u5176\u4ED6\u82B1\u8CBB")) {
          showAlert({
            title: "\u540D\u7A31\u91CD\u8907",
            icon: "error"
          });
          return false;
        }
        span.classList.remove("d-none");
        input.classList.add("d-none");
        parent.querySelector(".bi-pencil-square").classList.remove("d-none");
        parent.querySelector(".bi-check-square").classList.add("d-none");
        if (oldText === newText) {
          return true;
        }
        if (span.textContent != newText) {
          span.textContent = newText;
          const item = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].find((item2) => item2.name == oldText);
          item.name = newText;
          await Data$1.set(DataValue$1);
          renderDataContent(DataValue$1, UserSettingValue$1);
          UserSettingValue$1.CurrentAccountings.forEach((item2, i) => {
            if (item2 === oldText) {
              UserSettingValue$1.CurrentAccountings[i] = newText;
            }
          });
          await UserSetting$1.set(UserSettingValue$1);
          const current_accountingTarget = UserSettingValue$1.CurrentAccountings[UserSettingValue$1.CurrentAccountingIndex];
          if (current_accountingTarget === newText) {
            renderCarouselAccountingData(newText);
            renderAccountingDetail(DataValue$1[UserSettingValue$1.CurrentDateKey]["items"], current_accountingTarget);
          }
        }
        break;
      case "accounting":
      case "accountingList":
        const goal = span.textContent;
        const select = document.querySelector(".goal-options");
        select.value = goal;
        AccountingDetail.dataset.target = goal;
        await toggleAccounting(UserSettingValue$1.CurrentAccountingIndex);
        GoalDetailModal_bs.hide();
        Nav.querySelector(".nav-link[data-tab-target='#accountingDetail']").click();
        triggerState("tab", { tab_id: "#home", item_name: goal });
        if (target.dataset.action == "accounting")
          AccountingModal_bs.show();
        break;
    }
  });
  GoalDetailModal.addEventListener("show.bs.modal", (e) => {
    const target = e.target;
    const targetName = target.dataset.targetName;
    const item = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].find((item2) => item2.name == targetName);
    renderGoalDetailModal(targetName, item);
  });
  GoalDetailModal.addEventListener("hide.bs.modal", (e) => {
    const parent = e.target.querySelector(".modal-header");
    parent.querySelector(".modal-title-span").classList.remove("d-none");
    parent.querySelector(".modal-title-input").classList.add("d-none");
    parent.querySelector(".bi-pencil-square").classList.remove("d-none");
    parent.querySelector(".bi-check-square").classList.add("d-none");
  });
  GoalDetailModal.addEventListener("shown.bs.modal", (e) => {
    const renameInput = GoalDetailModal.querySelector(".modal-title-input");
    if (!renameInput.classList.contains("d-none")) {
      renameInput.focus();
    }
  });
  AccountingModal.addEventListener("click", async (e) => {
    const target = e.target;
    if (!target.dataset.action)
      return;
    const id = AccountingModal.dataset.id;
    const select = AccountingModal.querySelector(".goal-options");
    const goal = select.value;
    const isUnset = select.options[select.selectedIndex].dataset.hasOwnProperty("unset") ? true : false;
    let data;
    if (isUnset) {
      data = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["unset"];
    } else {
      let index2 = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].findIndex((item) => item.name === goal);
      data = DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"][index2];
    }
    let totalGoal = DataValue$1[UserSettingValue$1.CurrentDateKey]["totalGoal"];
    let current = data.current;
    let accounting = data.accounting;
    const amount = Number(AccountingModal.querySelector("[name='input-target-money']").value);
    const bonus = Number(AccountingModal.querySelector("[name='input-bonus-money']").value);
    switch (target.dataset.action) {
      case "insert":
      case "insert-next":
        if (!AccountingModal.querySelector("[name='input-target-money']").value || !AccountingModal.querySelector("[name='input-name']").value) {
          AccountingModal.querySelector("form").classList.add("was-validated");
          return;
        }
        accounting.push({
          id: ++DataValue$1[UserSettingValue$1.CurrentDateKey]["currentId"],
          name: AccountingModal.querySelector("[name='input-name']").value,
          amount,
          bonus,
          date: AccountingModal.querySelector("[name='input-date']").value.replace(/-/g, "/"),
          created_at: getCurrentFormattedDateTime(),
          unset: isUnset
        });
        totalGoal.current.amount += amount;
        totalGoal.current.bonus += bonus;
        current.amount += amount;
        current.bonus += bonus;
        await Data$1.set(DataValue$1);
        if (target.dataset.action == "insert")
          AccountingModal_bs.hide();
        AccountingModal.querySelector("[name='goal-options']").selectedIndex = 0;
        AccountingModal.querySelector("[name='input-target-money']").value = "";
        AccountingModal.querySelector("[name='input-bonus-money']").value = "";
        break;
      case "update":
        let acc = accounting.find((item) => item.id === Number(id));
        const oldTotalGoalAmount = totalGoal.current.amount;
        const oldTotalGoalBonus = totalGoal.current.bonus;
        const oldCurrentAmount = acc.amount;
        const oldCurrentBonus = acc.bonus;
        acc.name = AccountingModal.querySelector("[name='input-name']").value;
        acc.amount = amount;
        acc.bonus = bonus;
        acc.date = AccountingModal.querySelector("[name='input-date']").value.replace(/-/g, "/");
        totalGoal.current.amount += -oldTotalGoalAmount + amount;
        totalGoal.current.bonus += -oldTotalGoalBonus + bonus;
        current.amount += -oldCurrentAmount + amount;
        current.bonus += -oldCurrentBonus + bonus;
        await Data$1.set(DataValue$1);
        AccountingModal_bs.hide();
        break;
      case "delete":
        await showAlert({
          title: "\u78BA\u5B9A\u8981\u522A\u9664\uFF1F",
          icon: "error",
          showCancelButton: true
        }, async (confirm2) => {
          if (confirm2.isConfirmed) {
            let index2 = accounting.findIndex((item) => item.id === Number(id));
            accounting.splice(index2, 1);
            totalGoal.current.amount -= amount;
            totalGoal.current.bonus -= bonus;
            current.amount -= amount;
            current.bonus -= bonus;
            await Data$1.set(DataValue$1);
            AccountingModal_bs.hide();
          }
        });
        break;
    }
    const accountingTarget = UserSettingValue$1.CurrentAccountings[UserSettingValue$1.CurrentAccountingIndex];
    renderAccountingDetail(DataValue$1[UserSettingValue$1.CurrentDateKey]["items"], accountingTarget);
    if (!isUnset)
      renderGoalDetailModal(goal, data);
    renderDataContent(DataValue$1, UserSettingValue$1);
  });
  AccountingModal.addEventListener("show.bs.modal", (e) => {
    if (AccountingModal.dataset.action != "modify") {
      const today = new Date().toISOString().split("T")[0];
      AccountingModal.querySelector("[name='input-date']").value = today;
      AccountingModal.querySelectorAll(".modify").forEach((item) => {
        item.classList.add("d-none");
      });
      AccountingModal.querySelectorAll(".create").forEach((item) => {
        item.classList.remove("d-none");
      });
    } else {
      AccountingModal.querySelectorAll(".modify").forEach((item) => {
        item.classList.remove("d-none");
      });
      AccountingModal.querySelectorAll(".create").forEach((item) => {
        item.classList.add("d-none");
      });
    }
  });
  AccountingModal.addEventListener("hide.bs.modal", (e) => {
    delete AccountingModal.dataset.action;
  });
  AccountingModal.addEventListener("hidden.bs.modal", (e) => {
    if (AccountingDetail.dataset.target)
      AccountingModal.querySelector("[name='goal-options']").value = AccountingDetail.dataset.target;
    else
      AccountingModal.querySelector("[name='goal-options']").selectedIndex = 0;
    AccountingModal.querySelector("[name='input-name']").value = "";
    AccountingModal.querySelector("[name='input-target-money']").value = "";
    AccountingModal.querySelector("[name='input-bonus-money']").value = "";
    AccountingModal.querySelector("form").classList.remove("was-validated");
  });
  AccountingDetailContent.addEventListener("click", (e) => {
    const target = e.target;
    const itemParent = target.closest(".accounting-item");
    const groupParent = target.closest(".accounting-group");
    if (itemParent) {
      const goal = groupParent.querySelector(".accounting-goal").dataset.goal;
      const name = itemParent.querySelector(".accounting-name").textContent;
      let date = groupParent.querySelector(".accounting-date").dataset.date;
      date = date.replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/, (match, year, month, day) => {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      });
      date = new Date(date).toISOString().split("T")[0];
      const amount = itemParent.querySelector(".accounting-money").dataset.amount;
      const bonus = itemParent.querySelector(".accounting-money").dataset.bonus;
      AccountingModal.querySelector("[name='goal-options']").value = goal;
      AccountingModal.querySelector("[name='input-date']").value = date;
      AccountingModal.querySelector("[name='input-name']").value = name;
      AccountingModal.querySelector("[name='input-target-money']").value = amount;
      AccountingModal.querySelector("[name='input-bonus-money']").value = bonus == 0 ? "" : bonus;
      AccountingModal.dataset.action = "modify";
      AccountingModal.dataset.id = itemParent.dataset.id;
      AccountingModal_bs.show();
    }
  });
  document.querySelector("[contenteditable]").addEventListener("focus", (e) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(e.target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  });
  document.addEventListener("show.bs.dropdown", (e) => {
    setTimeout(() => {
      DropdownTrigger = e.relatedTarget;
    }, 0);
  });
  document.addEventListener("click", (e) => {
  });
  OpenAccountingModal.forEach((button) => {
    button.addEventListener("click", (e) => {
      AccountingModal_bs.show();
    });
  });
  HomeContent.addEventListener("click", (e) => {
    var _a, _b, _c;
    if (isLongPress)
      return;
    const target = e.target;
    const targetItems = target.closest(".items");
    const targetIsProgressItem = (_a = target.closest(".progress-item")) == null ? void 0 : _a.matches(".progress-item");
    const targetIsCheckbox = target.matches("input[type='checkbox']");
    const targetIsSortItem = target.matches(".sort_item");
    const targetIsSettingItem = target.matches(".setting_item");
    const targetIsSettingDropdown = (_b = target.closest(".item-setting-dropdown")) == null ? void 0 : _b.matches(".item-setting-dropdown");
    if (targetIsSettingDropdown)
      e.stopPropagation();
    if (targetItems && targetItems.classList.contains("items") && !targetIsSortItem && !targetIsSettingItem && !targetIsSettingDropdown && !targetIsProgressItem) {
      if (HomeContent.dataset.checkboxActive) {
        const checkbox = targetItems.querySelector(".select_item");
        if (!targetIsCheckbox)
          checkbox.checked = !checkbox.checked;
        const countLabel = ItemMainNav.querySelector(".count");
        let count = countLabel.dataset.count;
        if (checkbox.checked) {
          targetItems.classList.add("press-active");
          count++;
        } else {
          count--;
          targetItems.classList.remove("press-active");
          const checkboxes = document.querySelectorAll(".select_item");
          if (Array.from(checkboxes).every((checkbox2) => !checkbox2.checked)) {
            delete HomeContent.dataset.checkboxActive;
            HomeContent.querySelectorAll(".nav_item").forEach((s_item) => {
              s_item.classList.add("d-none");
            });
            ItemMainNav.classList.add("d-none");
          }
        }
        countLabel.dataset.count = count;
        countLabel.textContent = `\u5DF2\u9078\u53D6 ${count} \u9805`;
      } else {
        GoalDetailModal.dataset.targetName = targetItems.querySelector("label").textContent;
        GoalDetailModal_bs.show();
      }
    }
    if (targetIsProgressItem) {
      const progressItems = target.closest(".progress-item").querySelectorAll("span.percent, span.number");
      progressItems.forEach((progressItem) => {
        if (progressItem.classList.contains("d-none"))
          progressItem.classList.remove("d-none");
        else
          progressItem.classList.add("d-none");
      });
    }
    if (targetIsSettingDropdown) {
      const targetName = target.closest(".item-setting-dropdown").dataset.name;
      const action = (_c = target.closest(".dropdown-item").dataset) == null ? void 0 : _c.action;
      switch (action) {
        case "detail":
        case "rename":
          GoalDetailModal.dataset.targetName = targetName;
          GoalDetailModal_bs.show();
          GoalDetailModal.click();
          if (action == "rename")
            GoalDetailModal.querySelector(".modal-header i[data-action='rename']").click();
          break;
        case "delete":
          showAlert({
            title: "\u78BA\u5B9A\u522A\u9664\u55CE\uFF1F",
            icon: "warning",
            showCancelButton: true
          }, async (confirm2) => {
            if (confirm2.isConfirmed) {
              DataValue$1 = await Data$1.remove(UserSettingValue$1.CurrentDateKey, [targetName]);
              renderDataContent(DataValue$1, UserSettingValue$1);
              showAlert({
                title: "\u5DF2\u6E05\u9664\u9078\u4E2D\u76EE\u6A19",
                icon: "success"
              }, resetStatus());
            }
          });
          break;
      }
    }
  });
  ItemMainNav.addEventListener("click", async (e) => {
    var _a;
    const target = e.target;
    switch ((_a = target.dataset) == null ? void 0 : _a.action) {
      case "close":
        itemSelectedMode("close");
        break;
      case "remove":
        await removeItem();
        itemSelectedMode();
        break;
      case "select_all":
        let count = 0;
        HomeContent.querySelectorAll(".items").forEach((item) => {
          item.querySelector(".select_item").checked = true;
          item.classList.add("press-active");
          count++;
        });
        const countLabel = ItemMainNav.querySelector(".count");
        countLabel.dataset.count = count;
        countLabel.textContent = `\u5DF2\u9078\u53D6 ${count} \u9805`;
        break;
    }
  });
  HomeContent.addEventListener("mousedown", handleItemsStart);
  HomeContent.addEventListener("touchstart", handleItemsStart);
  HomeContent.addEventListener("mouseup", handleItemsEnd);
  HomeContent.addEventListener("touchend", handleItemsEnd);
  HomeContent.addEventListener("mouseover", handleItemsMove);
  HomeContent.addEventListener("touchmove", handleItemsMove);
  HomeContent.addEventListener("mouseover", handleItemNavOver);
  HomeContent.addEventListener("touchstart", handleItemNavOver);
  HomeContent.addEventListener("mouseout", handleItemNavOut);
  HomeContent.addEventListener("touchend", handleItemNavOut);
  SettingContent.addEventListener("change", async (e) => {
    const target = e.target;
    switch (target.id) {
      case "HomeLocation":
        UserSettingValue$1.HomeLocation = target.checked ? "home" : "accountingDetail";
        break;
      case "Mode":
        UserSettingValue$1.Mode = target.checked ? "t-mode" : "it-mode";
        break;
      case "ShowType":
        UserSettingValue$1.ShowType = target.checked ? "number" : "percent";
        break;
      case "NewItemPosition":
        UserSettingValue$1.NewItemPosition = target.checked ? "top" : "bottom";
        break;
      case "DebugMode":
        UserSettingValue$1.DebugMode = target.checked;
        if (!UserSettingValue$1.DebugMode) {
          await storage_clear();
        }
        break;
    }
    await UserSetting$1.set(UserSettingValue$1);
    Data$1 = await initData();
    DataValue$1 = await Data$1.get();
    await initDataContent(DataValue$1, UserSettingValue$1);
  });
  function handleItemsStart(e) {
    isLongPress = false;
    const target = e.target.closest(".items");
    const targetIsSortItem = e.target.matches(".sort_item");
    const targetDropdown = e.target.closest(".dropdown-menu");
    if (target && target.classList.contains("items") && !targetIsSortItem) {
      target.classList.add("long-press-active");
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.pageX;
      startY = touch.pageY;
      HomeContentPressTimer = setTimeout(() => {
        isLongPress = true;
        target.classList.add("press-active");
        target.querySelector(".select_item").checked = true;
        itemSelectedMode();
      }, 1e3);
    }
    if (!targetDropdown && DropdownTrigger) {
      new bootstrap.Dropdown(DropdownTrigger).hide();
      DropdownTrigger = null;
    }
  }
  function handleItemsEnd(e) {
    setTimeout(() => {
      isLongPress = false;
    }, 0);
    const target = e.target.closest(".items");
    if (target && target.classList.contains("items")) {
      target.classList.remove("long-press-active");
      clearTimeout(HomeContentPressTimer);
    }
  }
  function handleItemsMove(e) {
    const target = e.target.closest(".items");
    if (target && target.classList.contains("items")) {
      const touch = e.touches ? e.touches[0] : e;
      const moveX = touch.pageX;
      const moveY = touch.pageY;
      if (Math.abs(moveX - startX) >= 10 || Math.abs(moveY - startY) >= 10) {
        target.classList.remove("long-press-active");
        clearTimeout(HomeContentPressTimer);
      }
    }
  }
  function handleItemNavOver(e) {
    const target = e.target;
    if (target && (target.classList.contains("sort_item") || target.classList.contains("setting_item"))) {
      target.classList.add("nav_item-press-active");
    }
  }
  function handleItemNavOut(e) {
    const target = e.target;
    if (target && (target.classList.contains("sort_item") || target.classList.contains("setting_item"))) {
      target.classList.remove("nav_item-press-active");
    }
  }
  async function removeItem() {
    await showAlert({
      title: "\u76F8\u95DC\u5E33\u52D9\u4E5F\u8981\u4E00\u4F75\u522A\u9664\uFF0C\u78BA\u5B9A\u522A\u9664\u9078\u4E2D\u76EE\u6A19\u55CE\uFF1F",
      icon: "warning",
      showCancelButton: true
    }, async (confirm2) => {
      if (confirm2.isConfirmed) {
        const checkedArray = Array.from(HomeContent.querySelectorAll(".select_item[type='checkbox']:checked"));
        const nameArray = checkedArray.map((item) => item.closest(".items").querySelector("label").textContent);
        DataValue$1 = await Data$1.remove(UserSettingValue$1.CurrentDateKey, nameArray);
        renderDataContent(DataValue$1, UserSettingValue$1);
        const accountingTarget = UserSettingValue$1.CurrentAccountings[UserSettingValue$1.CurrentAccountingIndex];
        UserSettingValue$1.CurrentAccountings = UserSettingValue$1.CurrentAccountings.filter((item) => !nameArray.includes(item));
        await UserSetting$1.set(UserSettingValue$1);
        if (nameArray.includes(accountingTarget)) {
          CarouselAccountingControl.querySelector("button.carousel-control-next").click();
        } else {
          const accountingTarget2 = UserSettingValue$1.CurrentAccountings[UserSettingValue$1.CurrentAccountingIndex];
          renderAccountingDetail(DataValue$1[UserSettingValue$1.CurrentDateKey]["items"], accountingTarget2);
        }
        await showAlert({
          title: "\u5DF2\u522A\u9664\u9078\u4E2D\u76EE\u6A19",
          icon: "success"
        }, resetStatus());
      }
    });
  }
  async function toggleAccounting(index2) {
    UserSettingValue$1.CurrentAccountingIndex = index2;
    await UserSetting$1.set(UserSettingValue$1);
    const accountingTarget = UserSettingValue$1.CurrentAccountings[index2];
    renderCarouselAccountingData(accountingTarget);
    renderAccountingDetail(DataValue$1[UserSettingValue$1.CurrentDateKey]["items"], accountingTarget);
  }
  function itemSelectedMode(type = "") {
    if (type == "close") {
      HomeContent.querySelectorAll(".items").forEach((item) => {
        item.querySelector(".select_item").checked = false;
        item.classList.remove("press-active");
        item.querySelector(".nav_item").classList.add("d-none");
      });
      delete HomeContent.dataset.checkboxActive;
      ItemMainNav.classList.add("d-none");
      return;
    }
    HomeContent.dataset.checkboxActive = true;
    HomeContent.querySelectorAll(".nav_item").forEach((s_item) => {
      s_item.classList.remove("d-none");
    });
    const countLabel = ItemMainNav.querySelector(".count");
    const checkArray = Array.from(HomeContent.querySelectorAll(".select_item[type='checkbox']"));
    const checkedArray = Array.from(HomeContent.querySelectorAll(".select_item[type='checkbox']:checked"));
    countLabel.dataset.count = checkedArray.length;
    countLabel.textContent = `\u5DF2\u9078\u53D6 ${countLabel.dataset.count} \u9805`;
    if (checkArray.length <= 0) {
      ItemMainNav.classList.add("d-none");
      return;
    }
    ItemMainNav.classList.remove("d-none");
  }
  function triggerState(type, param = {}) {
    switch (type) {
      case "tab":
        push({
          type: "tab",
          callback: () => {
            Nav.querySelector(`[data-tab-target="${param.tab_id}"]`).click();
            console.log(`[data-sort-name="${param.item_name}"]`);
            HomeContent.querySelector(`[data-sort-name="${param.item_name}"]`).click();
          }
        });
        break;
    }
  }
  function resetStatus() {
    ItemMainNav.classList.add("d-none");
    HomeContent.querySelectorAll(".items").forEach((item) => {
      item.querySelector(".select_item").checked = false;
      item.classList.remove("press-active");
      item.querySelector(".nav_item").classList.add("d-none");
    });
    delete HomeContent.dataset.checkboxActive;
  }
}
async function refreshAccountings() {
  const old_accounting_target = UserSettingValue$1.CurrentAccountings[UserSettingValue$1.CurrentAccountingIndex];
  let new_items_array = [];
  document.querySelectorAll("#home-content .items").forEach((item) => {
    new_items_array.push(item.dataset.sortName);
  });
  new_items_array.unshift("\u7E3D\u89BD");
  new_items_array.push("\u5176\u4ED6\u82B1\u8CBB");
  UserSettingValue$1.CurrentAccountings = new_items_array;
  UserSettingValue$1.CurrentAccountingIndex = UserSettingValue$1.CurrentAccountings.indexOf(old_accounting_target);
  await UserSetting$1.set(UserSettingValue$1);
}
async function updateDataItemsSort(newOrder) {
  let orderMap = newOrder.reduce((map2, name, index2) => {
    map2[name] = index2;
    return map2;
  }, {});
  DataValue$1[UserSettingValue$1.CurrentDateKey]["items"]["normal"].sort((a, b) => orderMap[a.name] - orderMap[b.name]);
  await Data$1.set(DataValue$1);
  await refreshAccountings();
}
const NAMESPACE = "jeep-sqlite";
const BUILD = { allRenderFn: true, appendChildSlotFix: false, asyncLoading: true, asyncQueue: false, attachStyles: true, cloneNodeFix: false, cmpDidLoad: true, cmpDidRender: false, cmpDidUnload: false, cmpDidUpdate: false, cmpShouldUpdate: false, cmpWillLoad: true, cmpWillRender: false, cmpWillUpdate: false, connectedCallback: true, constructableCSS: true, cssAnnotations: true, devTools: false, disconnectedCallback: false, element: false, event: true, experimentalScopedSlotChanges: false, experimentalSlotFixes: false, formAssociated: false, hasRenderFn: true, hostListener: false, hostListenerTarget: false, hostListenerTargetBody: false, hostListenerTargetDocument: false, hostListenerTargetParent: false, hostListenerTargetWindow: false, hotModuleReplacement: false, hydrateClientSide: false, hydrateServerSide: false, hydratedAttribute: false, hydratedClass: true, hydratedSelectorName: "hydrated", initializeNextTick: false, invisiblePrehydration: true, isDebug: false, isDev: false, isTesting: false, lazyLoad: true, lifecycle: true, lifecycleDOMEvents: false, member: true, method: true, mode: false, observeAttribute: true, profile: false, prop: true, propBoolean: true, propMutable: false, propNumber: false, propString: true, reflect: true, scoped: false, scopedSlotTextContentFix: false, scriptDataOpts: false, shadowDelegatesFocus: false, shadowDom: true, slot: false, slotChildNodesFix: false, slotRelocation: false, state: true, style: true, svg: false, taskQueue: true, transformTagName: false, updatable: true, vdomAttribute: true, vdomClass: false, vdomFunctional: false, vdomKey: false, vdomListener: false, vdomPropOrAttr: true, vdomRef: false, vdomRender: false, vdomStyle: false, vdomText: false, vdomXlink: false, watchCallback: true };
var __defProp2 = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var hostRefs = /* @__PURE__ */ new WeakMap();
var getHostRef = (ref) => hostRefs.get(ref);
var registerInstance = (lazyInstance, hostRef) => hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);
var registerHost = (hostElement, cmpMeta) => {
  const hostRef = {
    $flags$: 0,
    $hostElement$: hostElement,
    $cmpMeta$: cmpMeta,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  {
    hostRef.$onInstancePromise$ = new Promise((r) => hostRef.$onInstanceResolve$ = r);
  }
  {
    hostRef.$onReadyPromise$ = new Promise((r) => hostRef.$onReadyResolve$ = r);
    hostElement["s-p"] = [];
    hostElement["s-rc"] = [];
  }
  return hostRefs.set(hostElement, hostRef);
};
var isMemberInElement = (elm, memberName) => memberName in elm;
var consoleError = (e, el) => (0, console.error)(e, el);
var cmpModules = /* @__PURE__ */ new Map();
var loadModule = (cmpMeta, hostRef, hmrVersionId) => {
  const exportName = cmpMeta.$tagName$.replace(/-/g, "_");
  const bundleId = cmpMeta.$lazyBundleId$;
  if (!bundleId) {
    return void 0;
  }
  const module = cmpModules.get(bundleId);
  if (module) {
    return module[exportName];
  }
  if (!hmrVersionId || !BUILD.hotModuleReplacement) {
    const processMod = (importedModule) => {
      cmpModules.set(bundleId, importedModule);
      return importedModule[exportName];
    };
    switch (bundleId) {
      case "jeep-sqlite":
        return __vitePreload(() => import(
          /* webpackMode: "lazy" */
          "./jeep-sqlite.entry.5a9776ea.js"
        ), true ? [] : void 0).then(processMod, consoleError);
    }
  }
  return __vitePreload(() => import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${bundleId}.entry.js${""}`
  ), true ? [] : void 0).then((importedModule) => {
    {
      cmpModules.set(bundleId, importedModule);
    }
    return importedModule[exportName];
  }, consoleError);
};
var styles = /* @__PURE__ */ new Map();
var HYDRATED_CSS = "{visibility:hidden}.hydrated{visibility:inherit}";
var SLOT_FB_CSS = "slot-fb{display:contents}slot-fb[hidden]{display:none}";
var win = typeof window !== "undefined" ? window : {};
var doc = win.document || { head: {} };
var plt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (h2) => h2(),
  raf: (h2) => requestAnimationFrame(h2),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
  ce: (eventName, opts) => new CustomEvent(eventName, opts)
};
var promiseResolve = (v) => Promise.resolve(v);
var supportsConstructableStylesheets = /* @__PURE__ */ (() => {
  try {
    new CSSStyleSheet();
    return typeof new CSSStyleSheet().replaceSync === "function";
  } catch (e) {
  }
  return false;
})();
var queuePending = false;
var queueDomReads = [];
var queueDomWrites = [];
var queueTask = (queue, write) => (cb) => {
  queue.push(cb);
  if (!queuePending) {
    queuePending = true;
    if (write && plt.$flags$ & 4) {
      nextTick(flush);
    } else {
      plt.raf(flush);
    }
  }
};
var consume = (queue) => {
  for (let i2 = 0; i2 < queue.length; i2++) {
    try {
      queue[i2](performance.now());
    } catch (e) {
      consoleError(e);
    }
  }
  queue.length = 0;
};
var flush = () => {
  consume(queueDomReads);
  {
    consume(queueDomWrites);
    if (queuePending = queueDomReads.length > 0) {
      plt.raf(flush);
    }
  }
};
var nextTick = (cb) => promiseResolve().then(cb);
var writeTask = /* @__PURE__ */ queueTask(queueDomWrites, true);
var EMPTY_OBJ = {};
var isDef = (v) => v != null;
var isComplexType = (o) => {
  o = typeof o;
  return o === "object" || o === "function";
};
function queryNonceMetaTagContent(doc2) {
  var _a, _b, _c;
  return (_c = (_b = (_a = doc2.head) == null ? void 0 : _a.querySelector('meta[name="csp-nonce"]')) == null ? void 0 : _b.getAttribute("content")) != null ? _c : void 0;
}
var result_exports = {};
__export(result_exports, {
  err: () => err,
  map: () => map,
  ok: () => ok,
  unwrap: () => unwrap,
  unwrapErr: () => unwrapErr
});
var ok = (value) => ({
  isOk: true,
  isErr: false,
  value
});
var err = (value) => ({
  isOk: false,
  isErr: true,
  value
});
function map(result, fn) {
  if (result.isOk) {
    const val = fn(result.value);
    if (val instanceof Promise) {
      return val.then((newVal) => ok(newVal));
    } else {
      return ok(val);
    }
  }
  if (result.isErr) {
    const value = result.value;
    return err(value);
  }
  throw "should never get here";
}
var unwrap = (result) => {
  if (result.isOk) {
    return result.value;
  } else {
    throw result.value;
  }
};
var unwrapErr = (result) => {
  if (result.isErr) {
    return result.value;
  } else {
    throw result.value;
  }
};
var createTime = (fnName, tagName = "") => {
  {
    return () => {
      return;
    };
  }
};
var uniqueTime = (key, measureText) => {
  {
    return () => {
      return;
    };
  }
};
var h = (nodeName, vnodeData, ...children) => {
  let child = null;
  let simple = false;
  let lastSimple = false;
  const vNodeChildren = [];
  const walk = (c) => {
    for (let i2 = 0; i2 < c.length; i2++) {
      child = c[i2];
      if (Array.isArray(child)) {
        walk(child);
      } else if (child != null && typeof child !== "boolean") {
        if (simple = typeof nodeName !== "function" && !isComplexType(child)) {
          child = String(child);
        }
        if (simple && lastSimple) {
          vNodeChildren[vNodeChildren.length - 1].$text$ += child;
        } else {
          vNodeChildren.push(simple ? newVNode(null, child) : child);
        }
        lastSimple = simple;
      }
    }
  };
  walk(children);
  const vnode = newVNode(nodeName, null);
  vnode.$attrs$ = vnodeData;
  if (vNodeChildren.length > 0) {
    vnode.$children$ = vNodeChildren;
  }
  return vnode;
};
var newVNode = (tag, text) => {
  const vnode = {
    $flags$: 0,
    $tag$: tag,
    $text$: text,
    $elm$: null,
    $children$: null
  };
  {
    vnode.$attrs$ = null;
  }
  return vnode;
};
var Host = {};
var isHost = (node) => node && node.$tag$ === Host;
var parsePropertyValue = (propValue, propType) => {
  if (propValue != null && !isComplexType(propValue)) {
    if (propType & 4) {
      return propValue === "false" ? false : propValue === "" || !!propValue;
    }
    if (propType & 1) {
      return String(propValue);
    }
    return propValue;
  }
  return propValue;
};
var getElement = (ref) => getHostRef(ref).$hostElement$;
var createEvent = (ref, name, flags) => {
  const elm = getElement(ref);
  return {
    emit: (detail) => {
      return emitEvent(elm, name, {
        bubbles: !!(flags & 4),
        composed: !!(flags & 2),
        cancelable: !!(flags & 1),
        detail
      });
    }
  };
};
var emitEvent = (elm, name, opts) => {
  const ev = plt.ce(name, opts);
  elm.dispatchEvent(ev);
  return ev;
};
var rootAppliedStyles = /* @__PURE__ */ new WeakMap();
var registerStyle = (scopeId2, cssText, allowCS) => {
  let style2 = styles.get(scopeId2);
  if (supportsConstructableStylesheets && allowCS) {
    style2 = style2 || new CSSStyleSheet();
    if (typeof style2 === "string") {
      style2 = cssText;
    } else {
      style2.replaceSync(cssText);
    }
  } else {
    style2 = cssText;
  }
  styles.set(scopeId2, style2);
};
var addStyle = (styleContainerNode, cmpMeta, mode) => {
  var _a;
  const scopeId2 = getScopeId(cmpMeta);
  const style2 = styles.get(scopeId2);
  styleContainerNode = styleContainerNode.nodeType === 11 ? styleContainerNode : doc;
  if (style2) {
    if (typeof style2 === "string") {
      styleContainerNode = styleContainerNode.head || styleContainerNode;
      let appliedStyles = rootAppliedStyles.get(styleContainerNode);
      let styleElm;
      if (!appliedStyles) {
        rootAppliedStyles.set(styleContainerNode, appliedStyles = /* @__PURE__ */ new Set());
      }
      if (!appliedStyles.has(scopeId2)) {
        {
          styleElm = doc.createElement("style");
          styleElm.innerHTML = style2;
          const nonce = (_a = plt.$nonce$) != null ? _a : queryNonceMetaTagContent(doc);
          if (nonce != null) {
            styleElm.setAttribute("nonce", nonce);
          }
          const injectStyle = !(cmpMeta.$flags$ & 1) || cmpMeta.$flags$ & 1 && styleContainerNode.nodeName !== "HEAD";
          if (injectStyle) {
            styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector("link"));
          }
        }
        if (cmpMeta.$flags$ & 4) {
          styleElm.innerHTML += SLOT_FB_CSS;
        }
        if (appliedStyles) {
          appliedStyles.add(scopeId2);
        }
      }
    } else if (!styleContainerNode.adoptedStyleSheets.includes(style2)) {
      styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style2];
    }
  }
  return scopeId2;
};
var attachStyles = (hostRef) => {
  const cmpMeta = hostRef.$cmpMeta$;
  const elm = hostRef.$hostElement$;
  const flags = cmpMeta.$flags$;
  const endAttachStyles = createTime("attachStyles", cmpMeta.$tagName$);
  const scopeId2 = addStyle(
    elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(),
    cmpMeta
  );
  if (flags & 10 && flags & 2) {
    elm["s-sc"] = scopeId2;
    elm.classList.add(scopeId2 + "-h");
  }
  endAttachStyles();
};
var getScopeId = (cmp, mode) => "sc-" + cmp.$tagName$;
var setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
  if (oldValue !== newValue) {
    let isProp = isMemberInElement(elm, memberName);
    memberName.toLowerCase();
    {
      const isComplex = isComplexType(newValue);
      if ((isProp || isComplex && newValue !== null) && !isSvg) {
        try {
          if (!elm.tagName.includes("-")) {
            const n = newValue == null ? "" : newValue;
            if (memberName === "list") {
              isProp = false;
            } else if (oldValue == null || elm[memberName] != n) {
              elm[memberName] = n;
            }
          } else {
            elm[memberName] = newValue;
          }
        } catch (e) {
        }
      }
      if (newValue == null || newValue === false) {
        if (newValue !== false || elm.getAttribute(memberName) === "") {
          {
            elm.removeAttribute(memberName);
          }
        }
      } else if ((!isProp || flags & 4 || isSvg) && !isComplex) {
        newValue = newValue === true ? "" : newValue;
        {
          elm.setAttribute(memberName, newValue);
        }
      }
    }
  }
};
var updateElement = (oldVnode, newVnode, isSvgMode2) => {
  const elm = newVnode.$elm$.nodeType === 11 && newVnode.$elm$.host ? newVnode.$elm$.host : newVnode.$elm$;
  const oldVnodeAttrs = oldVnode && oldVnode.$attrs$ || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
  {
    for (const memberName of sortedAttrNames(Object.keys(oldVnodeAttrs))) {
      if (!(memberName in newVnodeAttrs)) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], void 0, isSvgMode2, newVnode.$flags$);
      }
    }
  }
  for (const memberName of sortedAttrNames(Object.keys(newVnodeAttrs))) {
    setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode2, newVnode.$flags$);
  }
};
function sortedAttrNames(attrNames) {
  return attrNames.includes("ref") ? [...attrNames.filter((attr) => attr !== "ref"), "ref"] : attrNames;
}
var scopeId;
var hostTagName;
var useNativeShadowDom = false;
var isSvgMode = false;
var createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
  const newVNode2 = newParentVNode.$children$[childIndex];
  let i2 = 0;
  let elm;
  let childNode;
  {
    elm = newVNode2.$elm$ = doc.createElement(
      !useNativeShadowDom && BUILD.slotRelocation && newVNode2.$flags$ & 2 ? "slot-fb" : newVNode2.$tag$
    );
    {
      updateElement(null, newVNode2, isSvgMode);
    }
    const rootNode = elm.getRootNode();
    const isElementWithinShadowRoot = !rootNode.querySelector("body");
    if (!isElementWithinShadowRoot && BUILD.scoped && isDef(scopeId) && elm["s-si"] !== scopeId) {
      elm.classList.add(elm["s-si"] = scopeId);
    }
    if (newVNode2.$children$) {
      for (i2 = 0; i2 < newVNode2.$children$.length; ++i2) {
        childNode = createElm(oldParentVNode, newVNode2, i2);
        if (childNode) {
          elm.appendChild(childNode);
        }
      }
    }
  }
  elm["s-hn"] = hostTagName;
  return elm;
};
var addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
  let containerElm = parentElm;
  let childNode;
  if (containerElm.shadowRoot && containerElm.tagName === hostTagName) {
    containerElm = containerElm.shadowRoot;
  }
  for (; startIdx <= endIdx; ++startIdx) {
    if (vnodes[startIdx]) {
      childNode = createElm(null, parentVNode, startIdx);
      if (childNode) {
        vnodes[startIdx].$elm$ = childNode;
        insertBefore(containerElm, childNode, before);
      }
    }
  }
};
var removeVnodes = (vnodes, startIdx, endIdx) => {
  for (let index2 = startIdx; index2 <= endIdx; ++index2) {
    const vnode = vnodes[index2];
    if (vnode) {
      const elm = vnode.$elm$;
      if (elm) {
        elm.remove();
      }
    }
  }
};
var updateChildren = (parentElm, oldCh, newVNode2, newCh, isInitialRender = false) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let node;
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newStartVnode, isInitialRender)) {
      patch(oldStartVnode, newStartVnode, isInitialRender);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode, isInitialRender)) {
      patch(oldEndVnode, newEndVnode, isInitialRender);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode, isInitialRender)) {
      patch(oldStartVnode, newEndVnode, isInitialRender);
      insertBefore(parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode, isInitialRender)) {
      patch(oldEndVnode, newStartVnode, isInitialRender);
      insertBefore(parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      {
        node = createElm(oldCh && oldCh[newStartIdx], newVNode2, newStartIdx);
        newStartVnode = newCh[++newStartIdx];
      }
      if (node) {
        {
          insertBefore(oldStartVnode.$elm$.parentNode, node, oldStartVnode.$elm$);
        }
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    addVnodes(
      parentElm,
      newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$,
      newVNode2,
      newCh,
      newStartIdx,
      newEndIdx
    );
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
};
var isSameVnode = (leftVNode, rightVNode, isInitialRender = false) => {
  if (leftVNode.$tag$ === rightVNode.$tag$) {
    return true;
  }
  return false;
};
var patch = (oldVNode, newVNode2, isInitialRender = false) => {
  const elm = newVNode2.$elm$ = oldVNode.$elm$;
  const oldChildren = oldVNode.$children$;
  const newChildren = newVNode2.$children$;
  {
    {
      {
        updateElement(oldVNode, newVNode2, isSvgMode);
      }
    }
    if (oldChildren !== null && newChildren !== null) {
      updateChildren(elm, oldChildren, newVNode2, newChildren, isInitialRender);
    } else if (newChildren !== null) {
      addVnodes(elm, null, newVNode2, newChildren, 0, newChildren.length - 1);
    } else if (!isInitialRender && BUILD.updatable && oldChildren !== null) {
      removeVnodes(oldChildren, 0, oldChildren.length - 1);
    }
  }
};
var insertBefore = (parent, newNode, reference) => {
  const inserted = parent == null ? void 0 : parent.insertBefore(newNode, reference);
  return inserted;
};
var renderVdom = (hostRef, renderFnResults, isInitialLoad = false) => {
  const hostElm = hostRef.$hostElement$;
  const cmpMeta = hostRef.$cmpMeta$;
  const oldVNode = hostRef.$vnode$ || newVNode(null, null);
  const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
  hostTagName = hostElm.tagName;
  if (cmpMeta.$attrsToReflect$) {
    rootVnode.$attrs$ = rootVnode.$attrs$ || {};
    cmpMeta.$attrsToReflect$.map(
      ([propName, attribute]) => rootVnode.$attrs$[attribute] = hostElm[propName]
    );
  }
  if (isInitialLoad && rootVnode.$attrs$) {
    for (const key of Object.keys(rootVnode.$attrs$)) {
      if (hostElm.hasAttribute(key) && !["key", "ref", "style", "class"].includes(key)) {
        rootVnode.$attrs$[key] = hostElm[key];
      }
    }
  }
  rootVnode.$tag$ = null;
  rootVnode.$flags$ |= 4;
  hostRef.$vnode$ = rootVnode;
  rootVnode.$elm$ = oldVNode.$elm$ = hostElm.shadowRoot || hostElm;
  {
    scopeId = hostElm["s-sc"];
  }
  useNativeShadowDom = (cmpMeta.$flags$ & 1) !== 0;
  patch(oldVNode, rootVnode, isInitialLoad);
};
var attachToAncestor = (hostRef, ancestorComponent) => {
  if (ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent["s-p"]) {
    ancestorComponent["s-p"].push(new Promise((r) => hostRef.$onRenderResolve$ = r));
  }
};
var scheduleUpdate = (hostRef, isInitialLoad) => {
  {
    hostRef.$flags$ |= 16;
  }
  if (hostRef.$flags$ & 4) {
    hostRef.$flags$ |= 512;
    return;
  }
  attachToAncestor(hostRef, hostRef.$ancestorComponent$);
  const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
  return writeTask(dispatch);
};
var dispatchHooks = (hostRef, isInitialLoad) => {
  const elm = hostRef.$hostElement$;
  const endSchedule = createTime("scheduleUpdate", hostRef.$cmpMeta$.$tagName$);
  const instance = hostRef.$lazyInstance$;
  if (!instance) {
    throw new Error(
      `Can't render component <${elm.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`
    );
  }
  let maybePromise;
  if (isInitialLoad) {
    {
      maybePromise = safeCall(instance, "componentWillLoad");
    }
  }
  endSchedule();
  return enqueue(maybePromise, () => updateComponent(hostRef, instance, isInitialLoad));
};
var enqueue = (maybePromise, fn) => isPromisey(maybePromise) ? maybePromise.then(fn).catch((err2) => {
  console.error(err2);
  fn();
}) : fn();
var isPromisey = (maybePromise) => maybePromise instanceof Promise || maybePromise && maybePromise.then && typeof maybePromise.then === "function";
var updateComponent = async (hostRef, instance, isInitialLoad) => {
  var _a;
  const elm = hostRef.$hostElement$;
  const endUpdate = createTime("update", hostRef.$cmpMeta$.$tagName$);
  const rc = elm["s-rc"];
  if (isInitialLoad) {
    attachStyles(hostRef);
  }
  const endRender = createTime("render", hostRef.$cmpMeta$.$tagName$);
  {
    callRender(hostRef, instance, elm, isInitialLoad);
  }
  if (rc) {
    rc.map((cb) => cb());
    elm["s-rc"] = void 0;
  }
  endRender();
  endUpdate();
  {
    const childrenPromises = (_a = elm["s-p"]) != null ? _a : [];
    const postUpdate = () => postUpdateComponent(hostRef);
    if (childrenPromises.length === 0) {
      postUpdate();
    } else {
      Promise.all(childrenPromises).then(postUpdate);
      hostRef.$flags$ |= 4;
      childrenPromises.length = 0;
    }
  }
};
var callRender = (hostRef, instance, elm, isInitialLoad) => {
  try {
    instance = instance.render();
    {
      hostRef.$flags$ &= ~16;
    }
    {
      hostRef.$flags$ |= 2;
    }
    {
      {
        {
          renderVdom(hostRef, instance, isInitialLoad);
        }
      }
    }
  } catch (e) {
    consoleError(e, hostRef.$hostElement$);
  }
  return null;
};
var postUpdateComponent = (hostRef) => {
  const tagName = hostRef.$cmpMeta$.$tagName$;
  const elm = hostRef.$hostElement$;
  const endPostUpdate = createTime("postUpdate", tagName);
  const instance = hostRef.$lazyInstance$;
  const ancestorComponent = hostRef.$ancestorComponent$;
  if (!(hostRef.$flags$ & 64)) {
    hostRef.$flags$ |= 64;
    {
      addHydratedFlag(elm);
    }
    {
      safeCall(instance, "componentDidLoad");
    }
    endPostUpdate();
    {
      hostRef.$onReadyResolve$(elm);
      if (!ancestorComponent) {
        appDidLoad();
      }
    }
  } else {
    endPostUpdate();
  }
  {
    hostRef.$onInstanceResolve$(elm);
  }
  {
    if (hostRef.$onRenderResolve$) {
      hostRef.$onRenderResolve$();
      hostRef.$onRenderResolve$ = void 0;
    }
    if (hostRef.$flags$ & 512) {
      nextTick(() => scheduleUpdate(hostRef, false));
    }
    hostRef.$flags$ &= ~(4 | 512);
  }
};
var appDidLoad = (who) => {
  {
    addHydratedFlag(doc.documentElement);
  }
  nextTick(() => emitEvent(win, "appload", { detail: { namespace: NAMESPACE } }));
};
var safeCall = (instance, method, arg) => {
  if (instance && instance[method]) {
    try {
      return instance[method](arg);
    } catch (e) {
      consoleError(e);
    }
  }
  return void 0;
};
var addHydratedFlag = (elm) => {
  var _a;
  return elm.classList.add((_a = BUILD.hydratedSelectorName) != null ? _a : "hydrated");
};
var getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
var setValue = (ref, propName, newVal, cmpMeta) => {
  const hostRef = getHostRef(ref);
  if (!hostRef) {
    throw new Error(
      `Couldn't find host element for "${cmpMeta.$tagName$}" as it is unknown to this Stencil runtime. This usually happens when integrating a 3rd party Stencil component with another Stencil component or application. Please reach out to the maintainers of the 3rd party Stencil component or report this on the Stencil Discord server (https://chat.stenciljs.com) or comment on this similar [GitHub issue](https://github.com/ionic-team/stencil/issues/5457).`
    );
  }
  const elm = hostRef.$hostElement$;
  const oldVal = hostRef.$instanceValues$.get(propName);
  const flags = hostRef.$flags$;
  const instance = hostRef.$lazyInstance$;
  newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
  const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
  const didValueChange = newVal !== oldVal && !areBothNaN;
  if ((!(flags & 8) || oldVal === void 0) && didValueChange) {
    hostRef.$instanceValues$.set(propName, newVal);
    if (instance) {
      if (cmpMeta.$watchers$ && flags & 128) {
        const watchMethods = cmpMeta.$watchers$[propName];
        if (watchMethods) {
          watchMethods.map((watchMethodName) => {
            try {
              instance[watchMethodName](newVal, oldVal, propName);
            } catch (e) {
              consoleError(e, elm);
            }
          });
        }
      }
      if ((flags & (2 | 16)) === 2) {
        scheduleUpdate(hostRef, false);
      }
    }
  }
};
var proxyComponent = (Cstr, cmpMeta, flags) => {
  var _a, _b;
  const prototype = Cstr.prototype;
  if (cmpMeta.$members$ || (cmpMeta.$watchers$ || Cstr.watchers)) {
    if (Cstr.watchers && !cmpMeta.$watchers$) {
      cmpMeta.$watchers$ = Cstr.watchers;
    }
    const members = Object.entries((_a = cmpMeta.$members$) != null ? _a : {});
    members.map(([memberName, [memberFlags]]) => {
      if (memberFlags & 31 || flags & 2 && memberFlags & 32) {
        Object.defineProperty(prototype, memberName, {
          get() {
            return getValue(this, memberName);
          },
          set(newValue) {
            setValue(this, memberName, newValue, cmpMeta);
          },
          configurable: true,
          enumerable: true
        });
      } else if (flags & 1 && memberFlags & 64) {
        Object.defineProperty(prototype, memberName, {
          value(...args) {
            var _a2;
            const ref = getHostRef(this);
            return (_a2 = ref == null ? void 0 : ref.$onInstancePromise$) == null ? void 0 : _a2.then(() => {
              var _a3;
              return (_a3 = ref.$lazyInstance$) == null ? void 0 : _a3[memberName](...args);
            });
          }
        });
      }
    });
    if (flags & 1) {
      const attrNameToPropName = /* @__PURE__ */ new Map();
      prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {
        plt.jmp(() => {
          var _a2;
          const propName = attrNameToPropName.get(attrName);
          if (this.hasOwnProperty(propName)) {
            newValue = this[propName];
            delete this[propName];
          } else if (prototype.hasOwnProperty(propName) && typeof this[propName] === "number" && this[propName] == newValue) {
            return;
          } else if (propName == null) {
            const hostRef = getHostRef(this);
            const flags2 = hostRef == null ? void 0 : hostRef.$flags$;
            if (flags2 && !(flags2 & 8) && flags2 & 128 && newValue !== oldValue) {
              const instance = hostRef.$lazyInstance$;
              const entry = (_a2 = cmpMeta.$watchers$) == null ? void 0 : _a2[attrName];
              entry == null ? void 0 : entry.forEach((callbackName) => {
                if (instance[callbackName] != null) {
                  instance[callbackName].call(instance, newValue, oldValue, attrName);
                }
              });
            }
            return;
          }
          this[propName] = newValue === null && typeof this[propName] === "boolean" ? false : newValue;
        });
      };
      Cstr.observedAttributes = Array.from(
        /* @__PURE__ */ new Set([
          ...Object.keys((_b = cmpMeta.$watchers$) != null ? _b : {}),
          ...members.filter(([_, m]) => m[0] & 15).map(([propName, m]) => {
            var _a2;
            const attrName = m[1] || propName;
            attrNameToPropName.set(attrName, propName);
            if (m[0] & 512) {
              (_a2 = cmpMeta.$attrsToReflect$) == null ? void 0 : _a2.push([propName, attrName]);
            }
            return attrName;
          })
        ])
      );
    }
  }
  return Cstr;
};
var initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId) => {
  let Cstr;
  if ((hostRef.$flags$ & 32) === 0) {
    hostRef.$flags$ |= 32;
    const bundleId = cmpMeta.$lazyBundleId$;
    if (bundleId) {
      const CstrImport = loadModule(cmpMeta);
      if (CstrImport && "then" in CstrImport) {
        const endLoad = uniqueTime();
        Cstr = await CstrImport;
        endLoad();
      } else {
        Cstr = CstrImport;
      }
      if (!Cstr) {
        throw new Error(`Constructor for "${cmpMeta.$tagName$}#${hostRef.$modeName$}" was not found`);
      }
      if (!Cstr.isProxied) {
        {
          cmpMeta.$watchers$ = Cstr.watchers;
        }
        proxyComponent(Cstr, cmpMeta, 2);
        Cstr.isProxied = true;
      }
      const endNewInstance = createTime("createInstance", cmpMeta.$tagName$);
      {
        hostRef.$flags$ |= 8;
      }
      try {
        new Cstr(hostRef);
      } catch (e) {
        consoleError(e);
      }
      {
        hostRef.$flags$ &= ~8;
      }
      {
        hostRef.$flags$ |= 128;
      }
      endNewInstance();
      fireConnectedCallback(hostRef.$lazyInstance$);
    } else {
      Cstr = elm.constructor;
      const cmpTag = elm.localName;
      customElements.whenDefined(cmpTag).then(() => hostRef.$flags$ |= 128);
    }
    if (Cstr && Cstr.style) {
      let style2;
      if (typeof Cstr.style === "string") {
        style2 = Cstr.style;
      }
      const scopeId2 = getScopeId(cmpMeta);
      if (!styles.has(scopeId2)) {
        const endRegisterStyles = createTime("registerStyles", cmpMeta.$tagName$);
        registerStyle(scopeId2, style2, !!(cmpMeta.$flags$ & 1));
        endRegisterStyles();
      }
    }
  }
  const ancestorComponent = hostRef.$ancestorComponent$;
  const schedule = () => scheduleUpdate(hostRef, true);
  if (ancestorComponent && ancestorComponent["s-rc"]) {
    ancestorComponent["s-rc"].push(schedule);
  } else {
    schedule();
  }
};
var fireConnectedCallback = (instance) => {
  {
    safeCall(instance, "connectedCallback");
  }
};
var connectedCallback = (elm) => {
  if ((plt.$flags$ & 1) === 0) {
    const hostRef = getHostRef(elm);
    const cmpMeta = hostRef.$cmpMeta$;
    const endConnected = createTime("connectedCallback", cmpMeta.$tagName$);
    if (!(hostRef.$flags$ & 1)) {
      hostRef.$flags$ |= 1;
      {
        let ancestorComponent = elm;
        while (ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host) {
          if (ancestorComponent["s-p"]) {
            attachToAncestor(hostRef, hostRef.$ancestorComponent$ = ancestorComponent);
            break;
          }
        }
      }
      if (cmpMeta.$members$) {
        Object.entries(cmpMeta.$members$).map(([memberName, [memberFlags]]) => {
          if (memberFlags & 31 && elm.hasOwnProperty(memberName)) {
            const value = elm[memberName];
            delete elm[memberName];
            elm[memberName] = value;
          }
        });
      }
      {
        initializeComponent(elm, hostRef, cmpMeta);
      }
    } else {
      if (hostRef == null ? void 0 : hostRef.$lazyInstance$) {
        fireConnectedCallback(hostRef.$lazyInstance$);
      } else if (hostRef == null ? void 0 : hostRef.$onReadyPromise$) {
        hostRef.$onReadyPromise$.then(() => fireConnectedCallback(hostRef.$lazyInstance$));
      }
    }
    endConnected();
  }
};
var disconnectInstance = (instance) => {
};
var disconnectedCallback = async (elm) => {
  if ((plt.$flags$ & 1) === 0) {
    const hostRef = getHostRef(elm);
    if (hostRef == null ? void 0 : hostRef.$lazyInstance$)
      ;
    else if (hostRef == null ? void 0 : hostRef.$onReadyPromise$) {
      hostRef.$onReadyPromise$.then(() => disconnectInstance());
    }
  }
};
var bootstrapLazy = (lazyBundles, options = {}) => {
  var _a;
  const endBootstrap = createTime();
  const cmpTags = [];
  const exclude = options.exclude || [];
  const customElements2 = win.customElements;
  const head = doc.head;
  const metaCharset = /* @__PURE__ */ head.querySelector("meta[charset]");
  const dataStyles = /* @__PURE__ */ doc.createElement("style");
  const deferredConnectedCallbacks = [];
  let appLoadFallback;
  let isBootstrapping = true;
  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || "./", doc.baseURI).href;
  let hasSlotRelocation = false;
  lazyBundles.map((lazyBundle) => {
    lazyBundle[1].map((compactMeta) => {
      var _a2;
      const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3]
      };
      if (cmpMeta.$flags$ & 4) {
        hasSlotRelocation = true;
      }
      {
        cmpMeta.$members$ = compactMeta[2];
      }
      {
        cmpMeta.$attrsToReflect$ = [];
      }
      {
        cmpMeta.$watchers$ = (_a2 = compactMeta[4]) != null ? _a2 : {};
      }
      const tagName = cmpMeta.$tagName$;
      const HostElement = class extends HTMLElement {
        constructor(self2) {
          super(self2);
          this.hasRegisteredEventListeners = false;
          self2 = this;
          registerHost(self2, cmpMeta);
          if (cmpMeta.$flags$ & 1) {
            {
              if (!self2.shadowRoot) {
                {
                  self2.attachShadow({ mode: "open" });
                }
              } else {
                if (self2.shadowRoot.mode !== "open") {
                  throw new Error(
                    `Unable to re-use existing shadow root for ${cmpMeta.$tagName$}! Mode is set to ${self2.shadowRoot.mode} but Stencil only supports open shadow roots.`
                  );
                }
              }
            }
          }
        }
        connectedCallback() {
          getHostRef(this);
          if (!this.hasRegisteredEventListeners) {
            this.hasRegisteredEventListeners = true;
          }
          if (appLoadFallback) {
            clearTimeout(appLoadFallback);
            appLoadFallback = null;
          }
          if (isBootstrapping) {
            deferredConnectedCallbacks.push(this);
          } else {
            plt.jmp(() => connectedCallback(this));
          }
        }
        disconnectedCallback() {
          plt.jmp(() => disconnectedCallback(this));
        }
        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }
      };
      cmpMeta.$lazyBundleId$ = lazyBundle[0];
      if (!exclude.includes(tagName) && !customElements2.get(tagName)) {
        cmpTags.push(tagName);
        customElements2.define(
          tagName,
          proxyComponent(HostElement, cmpMeta, 1)
        );
      }
    });
  });
  if (cmpTags.length > 0) {
    if (hasSlotRelocation) {
      dataStyles.textContent += SLOT_FB_CSS;
    }
    {
      dataStyles.textContent += cmpTags.sort() + HYDRATED_CSS;
    }
    if (dataStyles.innerHTML.length) {
      dataStyles.setAttribute("data-styles", "");
      const nonce = (_a = plt.$nonce$) != null ? _a : queryNonceMetaTagContent(doc);
      if (nonce != null) {
        dataStyles.setAttribute("nonce", nonce);
      }
      head.insertBefore(dataStyles, metaCharset ? metaCharset.nextSibling : head.firstChild);
    }
  }
  isBootstrapping = false;
  if (deferredConnectedCallbacks.length) {
    deferredConnectedCallbacks.map((host) => host.connectedCallback());
  } else {
    {
      plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30));
    }
  }
  endBootstrap();
};
const globalScripts = () => {
};
const defineCustomElements = async (win2, options) => {
  if (typeof window === "undefined")
    return void 0;
  await globalScripts();
  return bootstrapLazy([["jeep-sqlite", [[1, "jeep-sqlite", { "autoSave": [516, "autosave"], "typeOrm": [516, "typeorm"], "wasmPath": [513, "wasmpath"], "pickText": [513, "picktext"], "saveText": [513, "savetext"], "buttonOptions": [513, "buttonoptions"], "innerAutoSave": [32], "innerTypeOrm": [32], "innerWasmPath": [32], "innerPickText": [32], "innerSaveText": [32], "innerButtonOptions": [32], "echo": [64], "createConnection": [64], "isConnection": [64], "closeConnection": [64], "open": [64], "close": [64], "getVersion": [64], "beginTransaction": [64], "commitTransaction": [64], "rollbackTransaction": [64], "isTransactionActive": [64], "execute": [64], "executeSet": [64], "run": [64], "query": [64], "getTableList": [64], "isDBExists": [64], "isDBOpen": [64], "deleteDatabase": [64], "isStoreOpen": [64], "copyFromAssets": [64], "isTableExists": [64], "createSyncTable": [64], "getSyncDate": [64], "setSyncDate": [64], "isJsonValid": [64], "importFromJson": [64], "exportToJson": [64], "deleteExportedRows": [64], "addUpgradeStatement": [64], "isDatabase": [64], "getDatabaseList": [64], "checkConnectionsConsistency": [64], "saveToStore": [64], "saveToLocalDisk": [64], "getFromLocalDiskToStore": [64], "getFromHTTPRequest": [64] }, null, { "autoSave": ["parseAutoSave"], "typeOrm": ["parseTypeOrm"], "wasmPath": ["parseWasmPath"], "pickText": ["parsePickText"], "saveText": ["parseSaveText"], "buttonOptions": ["parseButtonOptions"] }]]]], options);
};
(function() {
  if ("undefined" !== typeof window && void 0 !== window.Reflect && void 0 !== window.customElements) {
    var a = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(a, [], this.constructor);
    };
    HTMLElement.prototype = a.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, a);
  }
})();
registerPlugin("CapacitorSQLite", {
  web: () => __vitePreload(() => import("./web.5a4d939f.js"), true ? [] : void 0).then((m) => new m.CapacitorSQLiteWeb()),
  electron: () => window.CapacitorCustomPlatform.plugins.CapacitorSQLite
});
defineCustomElements();
let UserSetting, Data;
let UserSettingValue, DataValue;
window.addEventListener("DOMContentLoaded", async () => {
  UserSetting = await initUserSetting();
  UserSettingValue = await UserSetting.get();
  UserSettingValue.CurrentAccounting = "\u7E3D\u89BD";
  await UserSetting.set(UserSettingValue);
  Data = await initData();
  DataValue = await Data.get();
  await initDataContent(DataValue, UserSettingValue);
  await initEventListener();
  LocateHomePage();
  setTimeout(() => {
    document.querySelector("#app-loading").classList.add("d-none");
    document.querySelector("#app").classList.remove("d-none");
  }, 1e3);
});
function LocateHomePage() {
  if (UserSettingValue.HomeLocation == "accountingDetail") {
    document.querySelector("nav .nav-link[data-tab-target='#accountingDetail']").click();
  }
}
var style = "";
var custom = "";
export { Encoding as E, WebPlugin as W, buildRequestInit as b, createEvent as c, getElement as g, registerInstance as r };
