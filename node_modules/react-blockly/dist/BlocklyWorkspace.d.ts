/// <reference types="react" />
import PropTypes from "prop-types";
import { BlocklyWorkspaceProps } from "./BlocklyWorkspaceProps";
declare function BlocklyWorkspace({ initialXml, initialJson, toolboxConfiguration, workspaceConfiguration, className, onWorkspaceChange, onXmlChange, onJsonChange, onImportXmlError, onImportError, onInject, onDispose, }: BlocklyWorkspaceProps): JSX.Element;
declare namespace BlocklyWorkspace {
    var propTypes: {
        initialXml: PropTypes.Requireable<string>;
        initialJson: PropTypes.Requireable<object>;
        toolboxConfiguration: PropTypes.Requireable<object>;
        workspaceConfiguration: PropTypes.Requireable<object>;
        className: PropTypes.Requireable<string>;
        onWorkspaceChange: PropTypes.Requireable<(...args: any[]) => any>;
        onImportXmlError: PropTypes.Requireable<(...args: any[]) => any>;
        onImportError: PropTypes.Requireable<(...args: any[]) => any>;
        onXmlChange: PropTypes.Requireable<(...args: any[]) => any>;
        onJsonChange: PropTypes.Requireable<(...args: any[]) => any>;
        onInject: PropTypes.Requireable<(...args: any[]) => any>;
        onDispose: PropTypes.Requireable<(...args: any[]) => any>;
    };
    var defaultProps: {
        initialXml: null;
        initialJson: null;
        toolboxConfiguration: null;
        workspaceConfiguration: null;
        className: null;
        onWorkspaceChange: null;
        onImportXmlError: null;
        onImportError: null;
        onXmlChange: null;
        onJsonChange: null;
        onInject: null;
        onDispose: null;
    };
}
export default BlocklyWorkspace;
