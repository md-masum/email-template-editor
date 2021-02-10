import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import EmailEditor from "react-email-editor";

interface Design {
  id: number;
  name: string;
  template: any;
  html: any;
}

function App() {
  const emailEditorRef: any = useRef(null);

  const [template, setTemplate] = useState<Design[]>();

  const saveLocalStorage = (template: any, html: any) => {
    const designString = localStorage.getItem("design");
    if (designString != null) {
      const design: Design[] = JSON.parse(designString);
      design.push({
        id: design.length + 1,
        name: "design " + design.length + 1,
        template: template,
        html: html,
      });
      localStorage.setItem("design", JSON.stringify(design));
      setTemplate(design);
    } else {
      const design: Design[] = [];
      design.push({
        id: design.length + 1,
        name: "design " + design.length + 1,
        template: template,
        html: html,
      });
      localStorage.setItem("design", JSON.stringify(design));
      setTemplate(design);
    }
  };

  const saveDesign = () => {
    let jsonData: any = null;
    let htmlData: any = null;
    emailEditorRef.current.editor.saveDesign((design: any) => {
      jsonData = design;
      emailEditorRef.current.editor.exportHtml((data: any) => {
        const { design, html } = data;
        htmlData = html;
        saveLocalStorage(jsonData, htmlData);
      });
    });
  };

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data: any) => {
      const { design, html } = data;
      console.log(html);
      alert('please see console');
    });
  };

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const deleteTemplate = (id: number) => {
    const designString = localStorage.getItem("design");
    if (designString != null) {
      const design: Design[] = JSON.parse(designString);

      const indexOfObjectToRemove = design.findIndex((c) => c.id === id);

      if (indexOfObjectToRemove >= 0) {
        design.splice(indexOfObjectToRemove, 1);
      }
      localStorage.setItem("design", JSON.stringify(design));
      setTemplate(design);
    }
  };

  const loadTemplate = (id: number) => {
    const designString = localStorage.getItem("design");
    if (designString != null) {
      const design: Design[] = JSON.parse(designString);

      const object = design.find((c) => c.id === id);
      emailEditorRef.current.editor.loadDesign(object?.template);
    }
  };

  useEffect(() => {
    const designString = localStorage.getItem("design");
    if (designString != null) {
      const design: Design[] = JSON.parse(designString);
      setTemplate(design);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="text-center">React Email Template Editor</h1>
          <div className="row">
            {template?.map((item: Design, index: number) => (
              <div className="card col-4" key={index}>
                <div className="card-header row">
                  <div className="col-6 text-left">{item.name}</div>

                  <div className="col-6 text-right">
                    <button className='btn btn-outline-danger btn-sm'
                      onClick={() => deleteTemplate(item.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ cursor: "pointer" }}
                  onClick={() => loadTemplate(item.id)}
                >
                  <div
                    className="html-body"
                    dangerouslySetInnerHTML={{
                      __html: item.html,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={saveDesign} className="btn btn-outline-primary mr-2">
            Save Design
          </button>
          <button onClick={exportHtml} className="btn btn-outline-secondary">
            Export HTML
          </button>
        </div>

        <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </div>
    </div>
  );
}

export default App;
