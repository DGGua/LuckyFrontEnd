import birdimg from './images/bird.png'
import underlineimg from './images/underline.png'
import BackGround from '../../components/BackGround'
import './index.css'
import { Switch, Route } from 'react-router-dom'
import Home from '../Home'
import Wishes from '../Wishes'
import { LoginWHUT } from './loginSchools.jsx'
import { LoginCCNU } from './loginSchools.jsx'



export default function Login(props) {

    const goWHUT = () => {
        alert("你好武理帅哥/美女")
        props.history.push("/login/whut")
    }
    const goCCNU = () => {
        alert("你好华师美女/帅哥")
        props.history.push("/login/ccnu")
    }

    return (
        <div>
            <div className="login">
                <BackGround />
                <Switch>
                    <Route path="/login/whut" component={LoginWHUT} />
                    <Route path="/login/ccnu" component={LoginCCNU} />
                    <Route path="/login" component={LoginMain} />
                </Switch>
            </div>
        </div >
    )
}

function LoginMain(props) {

    const goWHUT = () => {
        alert("你好武理帅哥/美女")
        props.history.push("/login/whut")
    }
    const goCCNU = () => {
        alert("你好华师美女/帅哥")
        props.history.push("/login/ccnu")
    }

    return (
        <div>
            <p className="text-title">小幸运</p>
            <p className="text-subtitle">相遇，就是这么妙不可言</p>
            <div className="div-school">
                <Btn text="我是武小理" onClick={goWHUT} />
                <Btn text="我是华小师" onClick={goCCNU} />
            </div >
        </div>
    )
}

function Btn(props) {
    return (
        <div className="btn-school" onClick={props.onClick}>
            <img class="birdimg" src={birdimg} alt="" />
            <img class="underlineimg" src={underlineimg} alt="" />
            <p class="text-school">{props.text}</p>
        </div>
    )
}