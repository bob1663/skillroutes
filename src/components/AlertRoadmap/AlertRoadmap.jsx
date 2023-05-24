import React from "react";
import "./AlertRoadmap.css";
const AlertRoadmap = (props) => {
  const close = () => {
    props.handleAlert(props.index, props.m, false);
  };
  return (
    <div className="alert">
      <div className="alert-mini">
        <div className="alert__roadmap__title">{props.component.title}</div>
        <div className="alert__roadmap__description">
          {props.component.description}
        </div>
        {props.component.resources &&
          props.component.resources.map((res) => (
            <div className="alert__roadmap__resource">
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                /* onClick={(e) => {
                  e.preventDefault();
                  window.location.href = res.link;
                }} */
              >
                {res.title}
              </a>
            </div>
          ))}
        <div className="alert__buttons">
          <div className="alert__button" onClick={close}>
            Close
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlertRoadmap;
