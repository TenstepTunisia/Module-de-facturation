







import React from "react";
import * as ReactDOM from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

 
import Facturation from './components/Facturation';


export interface IFacturationWebPartProps {
  description: string;
}


 
export default class FacturationWebPart extends BaseClientSideWebPart<IFacturationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IFacturationWebPartProps> =
      React.createElement(
        Facturation,
        {} as IFacturationWebPartProps // Pass props here if needed
      );
 
    ReactDOM.render(element, this.domElement);
  }
 
  protected onInit(): Promise<void> {
    return super.onInit();
  }
 
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
}