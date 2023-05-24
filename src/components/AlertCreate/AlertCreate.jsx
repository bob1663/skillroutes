import React, {useEffect, useState} from "react";
import "./AlertCreate.css";
import images from "../../constants/images.js";
const AlertCreate = (props) => {
        const [resources,setResources]=useState(props.component.resources);
        const title=props.component.title;
        const [description, setDescription]=useState(props.component.description);
        const [component,setComponent]=useState({});
        const close=()=>{
            props.setTitleComponent(title,props.index,props.m);
            props.handleAlert(props.index,props.m,false);
        }
        const newResource=()=>{
            if(resources) {
                setResources([...resources, {
                    "title": "",
                    "link": "",
                    "text": ""
                }])
            }
            else{
                setResources([{
                    "title": "",
                    "link": "",
                    "text": ""
                }])
            }
        }
    const deleteResource=(index)=>{
        const newRes = resources.filter((block, i) => i !== index);
        setResources(newRes);
    }
        const [alert,setAlert]=useState(false);
    const save=()=>{
        let bad=false;
        resources.map(res=>{
            if(!isValidUrl(res.link)){
                bad=true;
                setAlert(true)
            }
        })
        if(!bad) {
            props.setComponent(component, props.index, props.m);
            props.handleAlert(props.index, props.m, false);
        }
    }
    useEffect(()=>{
        setComponent({
            resources:resources,
            title:props.component.title,
            description:description,
        });
    },[resources,props.component.title,description])
    const setResourceComponent=(e,index)=>{
        const newResource = [...resources];
        newResource[index] = {
            ...newResource[index],
            title: e.target.value
        };
        setResources(newResource);
    }
    const setResourceLinkComponent=(e,index)=>{
        const newResource = [...resources];
        newResource[index] = {
            ...newResource[index],
            link: e.target.value
        };
        setResources(newResource);
    }
    const isValidUrl = (url) => {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(url);
    }
    useEffect(() => {
        if (alert) {
            const timeout = setTimeout(() => {
                setAlert(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [alert]);
    return(
        <div className="alert">
            <div className="alert-mini">
                <textarea className="alert__title"  value={props.component.title} onChange={(e)=>{props.setTitleComponent(e.target.value,props.index,props.m)}}/>
                <textarea placeholder='Description' className="alert__description" value={props.component.description} onChange={(e)=>{setDescription(e.target.value)}}/>
                {resources&&resources.map((res,index)=>(
                    <div>
                        <textarea className="alert__resource" placeholder='Title' value={res.title} onChange={(e)=>{setResourceComponent(e,index)}}/>
                        <textarea className="alert__link" placeholder='Link' value={res.link} onChange={(e)=>{setResourceLinkComponent(e,index)}}/>
                        <img
                            src={images.Delete}
                            alt="delete"
                            className="alert-mini--delete"
                            onClick={() => {
                                deleteResource(index);
                            }}
                        />
                    </div>
                ))
                }
                <div className="alert__add" onClick={newResource}><span> Add link</span>
                <img src={images.Add} alt="add"/>
                </div>
                <div className="alert__buttons">
                <div className="alert__button" onClick={close}>Close</div>
                <div className="alert__button alert__button__right" onClick={save}>Save</div>
                {alert&&<div className='alert_error'>BAD URL</div>}
                </div>
            </div>
            </div>
    )
}
export default AlertCreate;
