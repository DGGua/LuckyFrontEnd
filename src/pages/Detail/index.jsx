import React, { useEffect, useState } from 'react'
import { ButtonS } from '../../components/Button'
import ConfirmPanel from '../../components/ConfirmPanel'
import Service from '../../common/service'
import forwardimg from '../../static/images/forward.svg'
import './index.scss'

const WishDetail = (props) => {

    const { changeShowConfirm, changeConfirmContent, changeBtnText, changeConfirmAction } = props.onChange

    const showForward = () => {
        changeConfirmContent(
            <>
                <p>快去复制以下链接</p>
                <p>将你的愿望分享出去吧~</p>
                <p>{props.pathname}</p>
            </>
        )
        changeConfirmAction(
            () => { changeShowConfirm(false) },
            () => { changeShowConfirm(false) }
        )
        changeShowConfirm(true)
    }

    return (
        <div className="content" >
            <img src={forwardimg} onClick={showForward} className="forward" style={{ display: props.needForward ? "relative" : "none" }} alt="" />
            <div className="text">
                {props.wish.wish}
            </div>
            <div className="wishInfo">
                <p>来自 {props.wish.wishman_name}</p>
                <p>{props.wish.creat_at}</p>
            </div>
        </div>
    )
}

const PersonMsg = (props) => {
    const { isWisher } = props

    return (
        <div className="msg">
            <div className="msg-text">
                <p className='h'>{isWisher ? "许愿人" : "点亮人"}</p>
                <p className='name'>李东哲</p>
            </div>
            <div className="msg-info">
                <p>于 2021-09-01&nbsp;&nbsp;00:00许愿</p>
                <p style={{ marginTop: "0.5em", textAlign: "left" }}>联系方式 :</p>
                <ul className="msg-number">
                    <li> QQ : 2601548431</li>
                    <li>电话 : 15373815535</li>
                </ul>
            </div>
        </div>
    )
}

// 别人的愿望，我已经点亮/实现
const OtherLighted = (props) => {
    const { changeShowConfirm, changeConfirmContent, changeBtnText, changeConfirmAction } = props.onChange

    const [currentIndex, setCurrentIndex] = useState("wuchu")
    const [otherMsg, setOtherMsg] = useState("")

    const msgs = {
        "wuchu": "刚刚误触了点亮按钮，不好意思啦~",
        "mang": "最近有点忙，短时间没有精力实现愿望了，抱歉"
    }

    const achieved = props.wish.state === 2

    // 点击已经实现愿望
    const pressAchieve = () => {
        changeConfirmAction(() => {
            changeShowConfirm(false);
            Service.achieveWish(props.wish.wish_id)
        }, () => {
            changeShowConfirm(false)
        })
        changeConfirmContent(
            <>
                <p style={{ alignSelf: "flex-start" }}>
                    确认已经实现这个愿望了嘛？
                </p>
                <p style={{ alignSelf: "flex-start", textAlign: "start" }}>
                    若确认，我们将发邮件提醒TA来确认你已经实现了TA的愿望
                </p>
            </>
        );
        changeShowConfirm(true);

    }
    // 点击放弃愿望
    const pressAbandon = () => {
        changeConfirmAction(pressReallyAbandon, () => { changeShowConfirm(false) })
        changeConfirmContent(
            <p>确认放弃这个愿望吗？</p>
        )
        changeShowConfirm(true);
    }

    // 点击确定放弃
    const pressReallyAbandon = () => {
        changeConfirmAction(() => {
            changeShowConfirm(false);
            changeBtnText('', '');
            let message = currentIndex === 'other' ? otherMsg : msgs[currentIndex]
            Service.giveUpLightWish(props.wish.wish_id, message).then(() => {
                props.goOtherPage("/mywish")
            })
        }, () => {
            changeShowConfirm(false);
            changeBtnText('', '');
            Service.giveUpLightWish(props.wish.wish_id).then(() => {
                props.goOtherPage("/mywish")
            })
        })
        changeConfirmContent(
            <div className='msg-borad'><p>你想要放弃这个愿望，<br />建议给对方留言说明原因哦：</p>
                <div className='options'>
                    <div><input type="radio" name='msg' value='wuchu' checked={true} onChange={(e) => { setCurrentIndex(e.currentTarget.value) }} /></div>
                    <p>刚刚误触了点亮按钮，不好意思啦~</p>
                </div>
                <div className='options'>
                    <div> <input type="radio" name='msg' value='mang' onChange={(e) => { setCurrentIndex(e.currentTarget.value) }} /></div>
                    <p>最近有点忙，短时间没有精力实现愿望了，抱歉</p>
                </div>
                <div className='options'>
                    <div><input type='radio' name='msg' value='other' onChange={(e) => { setCurrentIndex(e.currentTarget.value) }} /></div>
                    <div>
                        <p>留言给对方：</p>
                        <input type="text" placeholder='输入其他原因' className='reason' value={otherMsg} onChange={(e) => { setOtherMsg(e.target.value) }} />
                    </div>
                </div>
            </div>
        )
        changeBtnText("发送", "不留言")
    }

    return (
        <>
            <div className="panel-button">
                <ButtonS onClick={achieved ? null : pressAbandon}
                    style={{ background: "#FFFFFF", color: "#F25125", width: "6em" }}>
                    放弃实现
                </ButtonS>
                <ButtonS onClick={achieved ? null : pressAchieve}
                    style={{ background: achieved ? "#C0C0C0" : "#FF7A59", color: "#FFFFFF", width: "6em", marginLeft: "2em" }}>
                    {achieved ? "已经实现" : "确认实现"}
                </ButtonS>
            </div>
            <hr />
            <PersonMsg wish={props.wish} isWisher={true} />
        </>
    )
}
// 别人的愿望，没人实现
const OtherNotLighted = (props) => {

    const { goOtherPage, changeShowConfirm, changeConfirmContent, changeBtnText, changeConfirmAction } = props.onChange
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [tel, setTel] = useState("")
    const [option, setOption] = useState("QQ")

    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleNumber = (e) => {
        setNumber(e.target.value)
    }
    const handleTel = (e) => {
        setTel(e.target.value)
    }
    const handleOption = (e) => {
        setOption(e.target.value)
    }



    const pressLight = () => {
        changeConfirmContent(<p style={{ fontSize: "medium" }}>确认要帮TA实现这个愿望吗？</p>)
        changeConfirmAction(
            ReallyLight,
            () => {
                changeShowConfirm(false)
            }
        )
        changeShowConfirm(true)

    }

    const ReallyLight = () => {
        changeConfirmContent(
            <div className="input-msg" >
                <p className='info'>填写联系方式，方便他来联系你哦～</p>
                <div className="form">
                    <div className="name">
                        投递人 :
                        <input type="text" placeholder='必填内容哦～' onChange={handleName} value={name} style={{ marginLeft: "2em" }} />
                    </div>
                    <div className="number">
                        联系方式 :
                        <select onChange={handleOption} style={{ color: 'rgb(239, 96, 63)' }}>
                            <option value="QQ">QQ</option>
                            <option value="WeChat">微信</option>
                        </select>
                        <input type="text" placeholder='必填内容哦～' onChange={handleNumber} value={number} style={{ marginLeft: ".3em", width: "30%" }} />
                    </div>
                    <div className="tel" >
                        或 Tel :
                        <input type="text" placeholder='选填内容哦～' onChange={handleTel} value={tel} style={{ marginLeft: '2.3em' }} />
                    </div>
                </div>
            </div>
        )
        changeBtnText(
            "发送"
        )
        changeConfirmAction(() => {
            let id = props.wish.wish_id
            let [qq, wechat] = option === 'QQ' ? [number, ""] : ["", number]
            Service.lightWishOn(id, name, tel, qq, wechat).then((res) => {
                if (res.status === 0) {
                    alert("点亮成功~")
                    goOtherPage("/mywish")
                } else {
                    alert(res.msg)
                }
            })
            changeShowConfirm(false)
        }, () => {
            changeShowConfirm(false)
        })
    }

    return (
        <ButtonS onClick={pressLight}
            style={{ background: "#FFFFFF", color: "#F25125", width: "6em" }}>
            点亮这个心愿
        </ButtonS>
    )
}
// 我的愿望，没人实现
const MineNotLighted = (props) => {

    const { goOtherPage, changeShowConfirm, changeConfirmContent, changeConfirmAction } = props.onChange

    const pressDelete = () => {
        changeConfirmContent(<p style={{ fontSize: "medium" }}>确认删除这个愿望吗？</p>)
        changeConfirmAction(
            () => {
                Service.deleteWish(props.wish.wish_id).then(() => {
                    alert("删除成功")
                    goOtherPage("/mywish")
                })
                changeShowConfirm(false)
            },
            () => {
                changeShowConfirm(false)
            }
        )
        changeShowConfirm(true)
    }

    return (
        <ButtonS onClick={pressDelete}
            style={{ background: "#FFFFFF", color: "#F25125", width: "6em" }}>
            删除这个心愿
        </ButtonS>
    )
}

const MineLighted = (props) => {
    const { goOtherPage, changeShowConfirm, changeConfirmContent, changeBtnText, changeConfirmAction } = props.onChange
    const wish = props.wish
    let achieved = wish.state === 2

    const pressDelete = () => {
        changeConfirmContent(<p style={{ fontSize: "medium" }}>确认删除这个愿望吗？</p>)
        changeConfirmAction(
            () => {
                Service.deleteWish(props.wish.wish_id).then(() => {
                    alert("删除成功")
                    goOtherPage("/mywish")
                })
                changeShowConfirm(false)
            },
            () => {
                changeShowConfirm(false)
            }
        )
        changeShowConfirm(true)
    }
    const pressAchieve = () => {
        changeConfirmAction(() => {
            changeShowConfirm(false);
            Service.achieveWish(props.wish.wish_id).then(() => {
                goOtherPage("/mywish")
            })
        }, () => {
            changeShowConfirm(false)
        })
        changeConfirmContent(
            <p style={{ alignSelf: "flex-start" }}>
                确认愿望已经实现了吗？
            </p>

        );
        changeShowConfirm(true);
    }

    return (
        <>
            <div className="panel-button">
                <ButtonS onClick={achieved ? null : pressDelete}
                    style={{ background: "#FFFFFF", color: "#F25125", width: "6em" }}>
                    删除这个心愿
                </ButtonS>
                <ButtonS onClick={achieved ? null : pressAchieve}
                    style={{ background: achieved ? "#C0C0C0" : "#FF7A59", color: "#FFFFFF", width: "6em", marginLeft: "2em" }}>
                    {achieved ? "已经实现" : "确认实现"}
                </ButtonS>
            </div>
            <hr />
            <PersonMsg wish={wish} isWisher={false} />
        </>
    )

}


export default function Detail(props) {

    const [showConfirm, setShowConfirm] = useState(false) // 设置遮罩状态
    const [confirmContent, setConfirmContent] = useState('') // 设置弹窗内容
    const [btnText, setBtnText] = useState({}); // 设置按钮文本
    const [confirmAction, setConfirmAction] = useState({}); // 设置按钮触发
    const [wish, setWish] = useState({})            // 愿望内容
    const [isMine, setIsMine] = useState(false)     // 是不是自己的愿望

    const goOtherPage = (path) => {
        props.history.push(path)
    }

    const changeShowConfirm = (confirm) => {
        setShowConfirm(confirm)
    }

    const changeConfirmContent = (content) => {
        setConfirmContent(content)
    }

    const changeBtnText = (yes, no) => {
        setBtnText({
            'yes': yes ? yes : btnText.yes,
            'no': no ? no : btnText.no
        })
    }

    const changeConfirmAction = (yes, no) => {
        setConfirmAction({
            'yes': yes ? yes : confirmAction.yes,
            'no': no ? no : confirmAction.no
        })
    }

    useEffect(() => {
        let id = props.location.pathname.split('/').pop()
        id = parseInt(id)
        Service.getWishDetail(id).then((res) => {
            setWish(res.data)
            Service.getUserWishPost().then((res) => {
                res.data.wishes.forEach((wish) => {
                    if (wish.wish_id === id)
                        setIsMine(true)
                })
            })
        })
    }, [props.location.pathname])

    const onChange = {
        changeShowConfirm: changeShowConfirm,
        changeConfirmContent: changeConfirmContent,
        changeBtnText: changeBtnText,
        changeConfirmAction: changeConfirmAction,
        goOtherPage: goOtherPage
    }

    return (
        <div className='Detail'>
            <WishDetail wish={wish} needForward={!wish.state && isMine} onChange={onChange} pathname={props.location.pathname} />
            <div className="other">
                {
                    [
                        [
                            <OtherNotLighted wish={wish} onChange={onChange} />, // 别人的愿望，我未点亮
                            <OtherLighted wish={wish} onChange={onChange} />,    // 别人的愿望，我已点亮
                            <OtherLighted wish={wish} onChange={onChange} />     // 别人的愿望，我已实现
                        ],
                        [
                            <MineNotLighted wish={wish} onChange={onChange} />,  // 我的愿望，无人点亮
                            <MineLighted wish={wish} onChange={onChange} />,     // 我的愿望，有人点亮
                            <MineLighted wish={wish} onChange={onChange} />      // 我的愿望，已经实现
                        ]
                    ]
                    [isMine ? 1 : 0][wish.state]
                }
            </div>
            <ConfirmPanel display={showConfirm} action={confirmAction} btnText={btnText} >
                {confirmContent}
            </ConfirmPanel>
        </div >
    )
}