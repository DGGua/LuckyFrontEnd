import React, { useState, useEffect, ChangeEvent } from "react";
import ConfirmPanel from "../../components/ConfirmPanel";
import { ButtonS } from "../../components/Button";
import calendar from "../../static/images/calendar.svg";
import leaf from "../../static/images/leaf.svg";
import { IWishInfo_withName, Service } from "../../common/service";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { tags } from "../../config/Global";

const FALSE_0: number = 0;
// const SCHOOLINIT: 0 | 1 | 2 = 0;

export interface IWishesObject {
  wish: string;
  school: number;
  wishman_name: string;
  wish_id?: string;
}

interface IMyStyle {
  left: string;
  transition?: string;
  zIndex: number;
}
function toStyle(props: IMyStyle): React.CSSProperties {
  if (props.transition !== undefined) {
    let divStyle: React.CSSProperties = {
      left: props.left,
      transition: props.transition,
      zIndex: props.zIndex,
    };
    return divStyle;
  } else {
    let divStyle: React.CSSProperties = {
      left: props.left,
      zIndex: props.zIndex,
    };
    return divStyle;
  }
}

export interface IWishItemProps {
  className: string;
  wish: IWishInfo_withName;
  onTouchStart?: (e: any) => void;
  onTouchMove?: (e: any) => void;
  onTouchEnd?: () => void;
  setStyleID: number;
  myStyle: IMyStyle;
  wishtype: string;
}

const WishItem = (props: IWishItemProps) => {
  console.log(props.wish.wish);
  // console.log(props.wishtype);
  // console.log(props.wish.wish.desire)
  return (
    <div
      key={props.wish?.wishMan}
      className="wish-item"
      style={toStyle(props.myStyle)}
      onTouchStart={props.onTouchStart}
      onTouchMove={props.onTouchMove}
      onTouchEnd={props.onTouchEnd}
    >
      <img src={leaf} className="wish-img" alt="" />
      <div className="content">
        <div className="content-word">{props.wish.wish.desire}</div>
      </div>
      <div className="msg">
        <p>
          {props.wish.wish.school.toString() === ""
            ? ""
            : props.wish.wish.school.toString() === FALSE_0.toString()
            ? "华小师"
            : "武小理"}
        </p>{" "}
        {/* props.wish.school可能未定义，对接口*/}
        <p>
          {props.wish.wishMan.length > 0
            ? props.wish.wishMan.charAt(0) + "同学"
            : ""}
        </p>
      </div>
    </div>
  );
};

export interface IStartX {
  start: any; //touch.pageX和e.targetTouches[0]不知道是啥类型，详见130，131
  move: string;
}

export default function Wishes() {
  const navigate = useNavigate();
  const location = useLocation();
  // 拿着这个分类去发请求
  let STARTINIT: IStartX = {
    start: "",
    move: "",
  };

  interface ILocationState<T> {
    category: T;
  }
  let WISH_INIT: IWishInfo_withName = {
    wish: {
      desire_id: "",
      desire: "",
      light_at: "",
      create_at: "",
      finish_at: "",
      state: -1,
      type: 0,
      school: 0,
      light_id: -1,
      user_id: -1,
    },
    wishMan: "",
  };
  let WISHES_INIT: IWishInfo_withName[] = [WISH_INIT, WISH_INIT, WISH_INIT];
  // const category = (useLocation().state as ILocationState<string>).category;
  const state = useLocation().pathname.slice(15); //切割url获得愿望分类
  const [category, setCategory] = useState<number>(0);
  // useEffect(() => {
  //   tags.forEach((tag) => {
  //     if (tag.enName === state) setCategory(tag.category);
  //   });
  // },[1]);
  const [showTip, setShowTip] = useState(true);
  const moveState = { img1: 0, img2: 10, img3: 20 };
  const [move, setMove] = useState(moveState); // 树叶动画相关状态
  const [startX, setStartX] = useState(STARTINIT); // 树叶动画相关状态
  const [update, setUpDate] = useState(false); // 控制动画以及愿望内容的更新
  const [display, setDisplay] = useState(false); // 弹出确认框
  const [light, setLight] = useState(false);
  const [lightBtn, setLightBtn] = useState(true); // 点亮按钮是否存在
  const [wishes, setWishes] = useState<IWishInfo_withName[]>(WISHES_INIT);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [tel, setTel] = useState("");
  const [option, setOption] = useState("QQ");

  const [testFlag, setTestFlag] = useState("1");
  const refreshWishes = () => {
    Service.getWishByCategories_2(category.toString()).then((res) => {
      let wi = res.data.data;
      if (wi.length === 0) {
        setLightBtn(false);
        let wish: IWishInfo_withName = {
          wish: {
            desire_id: "",
            desire: "",
            light_at: "",
            create_at: "",
            finish_at: "",
            state: -1,
            type: 0,
            school: 0,
            light_id: -1,
            user_id: -1,
          },
          wishMan: "",
        };
        wi.push(wish);
      } else {
        setLightBtn(true);
      }
      while (wi.length < 3) {
        wi = [...wi, ...wi];
      }
      console.log("triggers");
      console.log(wi);
      setWishes(wi);

      setTestFlag("2");
    });
  };
  // 获取愿望
  useEffect(refreshWishes, [category, lightBtn]);
  useEffect(() => {
    console.log(1);
    console.log(wishes);
    console.log(1);
  }, [wishes]);
  // console.log(wishes[0].wish+"123")

  useEffect(() => {
    setInterval(() => {
      setShowTip(false);
    }, 5000);
  });

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };
  const handleTel = (e: ChangeEvent<HTMLInputElement>) => {
    setTel(e.target.value);
  };
  const handleOption = (e: ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value);
  };

  // Start/Move/End 都是控制愿望刷新动画的相关函数
  const onTouchStart = (e: any) => {
    //e:ChangeEvent<HTMLDivElement>替换为any，targeTouches类型未知
    const touch = e.targetTouches[0];
    setStartX({ start: touch.pageX, move: "" });
  };
  const onTouchMove = (e: any) => {
    //e:ChangeEvent<HTMLDivElement>替换为any，targeTouches类型未知
    const touch = e.targetTouches[0];
    const move_X = (touch.pageX - startX.start) / 5;
    setStartX(startX);
    setMove({ img1: move_X, img2: 10, img3: 20 });
  };
  const onTouchEnd = () => {
    setUpDate(true);
    if (move.img1 < -25) {
      setMove({ img1: -90, img2: 0, img3: 10 });
    } else if (move.img1 > 20) {
      setMove({ img1: 90, img2: 0, img3: 10 });
    } else {
      setMove({ img1: 0, img2: 10, img3: 20 });
      return;
    }
    // 刷新愿望
    setTimeout(() => {
      setUpDate(false);
      let newWishSource = wishes;
      if (!newWishSource) return;
      newWishSource.push(newWishSource[0]);
      newWishSource.splice(0, 1);
      setWishes(newWishSource);
      // 刷新动画
      setMove(moveState);
    }, 200);
  };
  // 查看我的点亮
  const goMyWish = () => {
    navigate("/detail/index");
    // props.history.push('/mywish')
  };
  const lightWish = () => {
    if (name === "") alert("还没有填写姓名哦~");
    else if (number === "") alert("还没有填写联系方式哦~");
    else {
      if (!wishes) return;
      if (wishes[0].wish.desire_id !== undefined) {
        let id = wishes[0].wish.desire_id;
        let [qq, wechat] = option === "QQ" ? [number, ""] : ["", number];
        Service.lightWishOn(id, name, tel, qq, wechat).then((res) => {
          if (res.status === 0) {
            alert("点亮成功~");
            refreshWishes();
          } else {
            alert(res.data.msg);
          }
        });
        handleAlert();
      }
    }
  };
  // 处理遮罩
  const handleAlert = () => {
    setLight(false);
    setDisplay(false);
  };
  // 处理点亮愿望
  const handleLight = () => {
    setLight(true);
  };
  const showConfirm = () => {
    setDisplay(true);
  };

  return (
    <div className="wishpage">
      <ConfirmPanel
        display={display}
        action={(response: boolean) =>
          response ? (light ? lightWish : handleLight) : handleAlert
        }
      >
        {light ? (
          <div className="input-msg">
            <p className="info">填写联系方式，方便他来联系你哦～</p>
            <div className="form">
              <div className="name">
                点亮人 :
                <input
                  type="text"
                  placeholder="必填内容哦～"
                  onChange={handleName}
                  value={name}
                  style={{ marginLeft: "2em" }}
                />
              </div>
              <div className="number">
                联系方式 :
                <select
                  onChange={handleOption}
                  style={{ color: "rgb(239, 96, 63)" }}
                >
                  <option value="QQ">QQ</option>
                  <option value="WeChat">微信</option>
                </select>
                <input
                  type="text"
                  placeholder="必填内容哦～"
                  onChange={handleNumber}
                  value={number}
                  style={{ marginLeft: ".3em", width: "30%" }}
                />
              </div>
              <div className="tel">
                或 Tel :
                <input
                  type="text"
                  placeholder="选填内容哦～"
                  onChange={handleTel}
                  value={tel}
                  style={{ marginLeft: "2.3em" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "medium" }}>确认要帮TA实现这个愿望吗</p>
        )}
      </ConfirmPanel>

      <ButtonS
        onClick={goMyWish}
        style={{
          background: "#F59D65",
          color: "white",
          marginTop: "13em",
          alignSelf: "flex-start",
          padding: "0.4em 0.7em",
          fontSize: "medium",
          zIndex: "999",
        }}
      >
        <img
          style={{ transform: "scale(3) translate(2%, 12%)" }}
          src={calendar}
          alt=""
        />
        查看我的点亮
      </ButtonS>
      <div className="wishes">
        {wishes.map((wish, index) => (
          <WishItem
            className="wish-img"
            wish={wish}
            setStyleID={0}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            myStyle={{
              left: `${move.img1}vw`,
              transition: update ? "all 0.2s" : "none",
              zIndex: 101,
            }}
            wishtype={state}
          />
        ))}
      </div>
      <ButtonS
        style={{
          position: "fixed",
          background: "#F59D65A0",
          color: "#FFFFFFA0",
          top: "65vh",
          right: "-1em",
          zIndex: "301",
          display: showTip ? "absolute" : "none",
        }}
      >
        左右滑查看更多许愿哦~
      </ButtonS>
      <ButtonS
        onClick={showConfirm}
        style={{
          background: "white",
          color: "#F59D65",
          marginTop: "22.5em",
          zIndex: "999",
          display: lightBtn ? "relative" : "none",
        }}
      >
        点亮TA的小幸运
      </ButtonS>
    </div>
  );
}
