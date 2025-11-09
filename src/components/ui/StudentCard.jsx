import "@/styles/ui/card.css"
import profielimg from "@/assets/sirimg.jpg"
import Ribbon from "./Ribbon"
import TopRibbon from "./TopRibbon"

export default function StudentCard({ }) {
    return (
        <div className="my_card my_shadow1">
            <Ribbon />
            <div className="student_card">
                <div className="card_image">
                    <img src={profielimg} alt="" />
                </div>
                <div className="card_content">
                    <div className="card_name">
                        <h3>Ayush Sharma</h3>
                    </div>
                    <div className="card_email">
                        <h4>ayush.s.sharma04@gmail.com</h4>
                    </div>
                    <div className="card_phone">
                        <h4>9326242640</h4>
                    </div>
                    <div className="card_view">
                        <button className="view_btn">View More</button>
                    </div>
                </div>
            </div>
        </div>
    )
}