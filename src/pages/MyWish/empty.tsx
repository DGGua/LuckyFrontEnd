import { useNavigate } from "react-router-dom";
import { ButtonS } from "../../components/Button";
import "./index.scss";

export function Empty() {
  const navigate = useNavigate();

  const goSendWish = () => {
    navigate("/tagscreen/fillwish");
  };

  return (
    <div className="div-leaf-empty">
      <div className="text-empty">
        空空如也~
        <br />
        你还没有许愿呢~
        <br />
        人还是要多许愿的
        <br />
        万一就实现了呢~
      </div>
      <ButtonS
        onClick={goSendWish}
        style={{ background: "white", color: "#F25125", fontSize: "x-large" }}
      >
        投递我的小幸运
      </ButtonS>
    </div>
  );
}
