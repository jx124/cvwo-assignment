import { useAppSelector } from "../../app/hooks";
import { selectAuthData } from "../auth/authSlice";
import { destroyPostAsync } from "./postSlice"

function ButtonGroup(props: any) {
    const authData = useAppSelector(selectAuthData);

    function handleClick(e: any) {
        const payload = {
            post: {
                post_id: props.post_id,
            },
            token: authData.token ? authData.token : "",
        }
        console.log("click: ", payload);
        props.dispatch(destroyPostAsync(payload));
    }

    return (
        <div className="btn-group float-end">
            <button className="btn btn-warning">Edit</button>
            <button className="btn btn-danger" onClick={(e) => handleClick(e)}>Delete</button>
        </div>
    )
}

export default ButtonGroup