import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { parse } from "url";
import "whatwg-fetch";
import { IWishObject } from "../pages/MyWish";
import { IWishesObject } from "../pages/Wishes";
import { appendParams2Path } from "./global";

const BASEURL = "http://127.0.0.1:4523/mock/1379753";

interface IGlobalResponse<T> {
  data: T;
  msg: string;
  status: number;
}

//对应后端新接口
export interface IUserInfo {
  email: string;
  wechat: string;
  tel: string;
  name: string;
  qq: string;
}
export interface IWishInfo {
  desire_id: string;
  desire: string;
  light_at: string;
  create_at: string;
  finish_at: string;
  state: -1 | 0 | 1 | 2 | 3; //-1初始化、0未点亮、1已点亮、2已实现、3已删除
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; //0初始化
  school: 0 | 1 | 2; //0错误or初始化、1武理、2华师
  light_id: number;
  user_id: number;
}
export interface IWishInfo_withName{
  wish:IWishInfo,
  wishMan:string
}
export interface IWishDetail {
  wishInfo: IWishInfo; //愿望信息
  user: IUserInfo; //许愿人信息
}
interface ILightInformation {
  light_name?: string;
  light_tel?: string;
  light_qq?: string;
  light_wechat?: string;
}

export interface IWishManInformation {
  wishMan_name?: string;
  wishMan_QQ?: string;
  wishMan_Wechat?: string;
  wishMan_Tel?: string;
}
async function GlobalAxios<T = any, D = any>(
  method: "post",
  url: string,
  data: D
): Promise<AxiosResponse<IGlobalResponse<T>, any>>;
async function GlobalAxios<T = any>(
  method: "get" | "delete",
  url: string
): Promise<AxiosResponse<IGlobalResponse<T>, any>>;
async function GlobalAxios<T = any, D = any>(
  method: "get" | "post" | "delete",
  url: string,
  data?: D
): Promise<AxiosResponse<IGlobalResponse<T>, any>> {
  let config: AxiosRequestConfig<D> = {};
  config.baseURL = BASEURL;
  config.headers = { token: localStorage.getItem("token") || "" };

  const parsedURL = parse(url);
  const params = new URLSearchParams(parsedURL.query || "");
  url = parsedURL.pathname || "";
  config.params = params;

  let response;
  if (method === "post") {
    response = await axios[method]<IGlobalResponse<T>>(url, data, config);
  } else {
    params.set("time", new Date().getTime().toString());
    response = await axios[method]<IGlobalResponse<T>>(url, config);
  }

  // TODO: have bug, check later
  if (response.statusText === "OK") {
    return response;
  } else if (response.status === -2) {
    alert(response.data.msg);
    localStorage.removeItem("token");

    // 重定向到根目录，重新登录
    let redirectpos = window.location.href;
    redirectpos = redirectpos.slice(0, redirectpos.indexOf("/", 10) + 1);
    // window.location.href(redirectpos)
    window.location.href = redirectpos;
  } else if (response.data.status !== 0) {
    alert(response.data.msg);
    return response;
  }

  return response;
}

export const Service = {
  //whut邮箱验证
  whutCheckEmail(email: string) {
    return GlobalAxios<{ emailVV: string }>(
      "post",
      "/whutregister/checkemail",
      {
        data: {
          email: email,
        },
      }
    );
  },
  //whut注册
  whutRegister() {
    return GlobalAxios<{ state: number }>("post", "/whutregister", {
      data: {
        //post数据待定
      },
    });
  },
  //whut登录
  whutLogin() {
    return GlobalAxios<string>("post", "/whutlogin", null); //返回status，msg，data（鉴权）
  },
  //（new）获取用户的信息
  getManInfo(id: string) {
    return GlobalAxios<IUserInfo>(
      "get",
      appendParams2Path("/user/info", { id: id })
    );
  },
  //（new）用户投递愿望
  postWish_2(
    name: string,
    qq: string,
    weChat: string,
    tel: string,
    desire: string,
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    school: 1 | 2
  ) {
    return GlobalAxios<string>("post", "/desires/add", {
      name: name,
      qq: qq,
      weChat: weChat,
      tel: tel,
      desire: desire,
      type: type,
      school: school,
    });
  },
  //（new）用户点亮愿望
  lightWish(id: string) {
    return GlobalAxios<string>("post", "/desires/light", {
      id: id,
    });
  },
  //（new）用户实现愿望
  achieveWish_2(id: string) {
    return GlobalAxios<string>("post", "/desires/achieve", {
      id: id,
    });
  },
  //（new）用户取消点亮愿望
  giveUpLightWish(id: string, message: string = "") {
    return GlobalAxios<string>("post", "/desires/giveup", {
      id: id,
      message: message,
    });
  },
  //（new）获取用户点亮的愿望信息
  get_lightedWishInfo() {
    return GlobalAxios<IWishInfo>("get", "/desires/user/light");
  },
  //（new）获取用户投递的愿望信息
  get_postedWishInfo() {
    return GlobalAxios<IWishInfo>("get", "/desires/user/post");
  },
  //（new）通过类型获取愿望
  getWishByCategories_2(categories: string) {
    return GlobalAxios<IWishInfo_withName[]>(
      "get",
      appendParams2Path("/wishestest/categories", { categories })
    );
  },
  //（new）获取愿望具体信息
  getWishDetail_2(id: string) {
    return GlobalAxios<IWishDetail>(
      "get",
      appendParams2Path("/wishes/details", {
        desire_id: id,
        time: new Date().getTime().toString(),
      })
    );
  },
  //用户删除愿望
  deleteWish_2(desire_id: string) {
    return GlobalAxios<string>(
      "delete",
      appendParams2Path("/wishes", { desire_id })
    );
  },

  //绑定邮箱
  bindEmail(email: string) {
    return GlobalAxios<string>("post", "/user/email", {
      data: {
        email: email,
      },
    });
  },
  //ccnu登录
  ccnuLogin(idcard_number: string, password: string) {
    return GlobalAxios<{
      idcard_number: string;
      password: string;
      token?: string;
    }>("post", "/ccnulogin", {
      idcard_number: idcard_number,
      password: password,
    });
  },
  //查询邮箱是否绑定
  checkUserEmail() {
    return GlobalAxios<null>("post", "/user/email/check", null);
  },
  //发出自己的愿望
  postWish(
    name: string,
    QQ: string,
    weChat: string,
    tel: string,
    wish: string,
    type: string
  ) {
    return GlobalAxios<{
      wishMan_inform: IWishManInformation;
      wish: string;
      type: string;
    }>("post", "/wished/add", {
      wishMan_inform: {
        wishMan_name: name,
        wishMan_QQ: QQ,
        wishMan_Wechat: weChat,
        wishMan_Tel: tel,
      },
    });
  },
  //点亮别人的愿望
  lightWishOn(
    id: string,
    name: string,
    tel: string,
    qq: string,
    wechat: string
  ) {
    return GlobalAxios<{
      wish_id: string;
      light_inform?: ILightInformation;
    }>("post", "/wishes/light", {
      wish_id: id,
      light_inform: {
        light_name: name,
        light_tel: tel,
        light_qq: qq,
        light_wechat: wechat,
      },
    });
  },
  //查看愿望详情
  getWishDetail(id: string) {
    return GlobalAxios<IWishObject>(
      "get",
      appendParams2Path("/wishes/details", {
        wish_id: id,
        time: new Date().getTime().toString(),
      })
    );
  },
  //查找点亮人信息
  getLightManInfo(id: string) {
    return GlobalAxios<{ id: number; wish_id: number } & ILightInformation>(
      "get",
      appendParams2Path("/user/info/lightman", {
        wish_id: id,
        time: new Date().getTime().toString(),
      })
    );
  },
  //获取自己点亮的愿望//后端接口重构Ligth
  getUserWishLight() {
    return GlobalAxios<IWishObject[]>("get", "/wishes/user/light");
  },
  //获取自己投递的愿望//后端接口重构Post
  getUserWishPost() {
    return GlobalAxios<IWishObject[]>("get", "/wishes/user/post");
  },
  //根据分类获取愿望
  getWishByCategories(categories: string) {
    return GlobalAxios<IWishesObject[]>(
      "get",
      appendParams2Path("/wishes/categories", { categories })
    );
  },
  //删除愿望
  deleteWish(wish_id: string) {
    return GlobalAxios("delete", appendParams2Path("/wishes", { wish_id }));
  },
  //放弃点亮别人的愿望
  // giveUpLightWish(wish_id: string, msg?: string) {
  //   return GlobalAxios<{
  //     wish_id: string;
  //     message: string;
  //   }>("post", "/wishes/giveup", {
  //     wish_id: wish_id,
  //     message: msg,
  //   });
  // },
  //实现别人的愿望
  achieveWish(wish_id: string) {
    return GlobalAxios<{
      wish_id: string;
    }>("post", "/wishes/achieve", {
      wish_id: wish_id,
    });
  },
};
