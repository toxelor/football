import {notification} from "antd";

export function openNotification(payload) {
    const {type, ...props} = payload
    notification[type]({
        ...props
    });
}