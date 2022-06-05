import { appConfig } from "../configs";

export function GetImageStringFromBE<T = string | undefined>(
    url: T
  ): string | T {
    function isImageBE(url: string): boolean {
      return url.startsWith("uploads");
    }
    return url && isImageBE(String(url))
      ? appConfig.backendUri + "/public/" + url
      : url;
  }
  
  export function GetAsyncFileFromPath(url: string): Promise<Blob> {
    return fetch(url).then((r) => r.blob());
  }
  
  export function IsImageUrl(url: string): boolean {
    return url.startsWith("uploads") || url.startsWith("http");
  }