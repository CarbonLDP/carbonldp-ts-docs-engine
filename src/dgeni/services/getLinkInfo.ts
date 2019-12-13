import { Document } from 'dgeni';
import path from "path";
import { PropertyMemberDoc } from 'dgeni-packages/typescript/api-doc-types/PropertyMemberDoc';
import winston from 'winston';

export interface LinkInfo {
    url: string,
    type: string,
    valid: boolean,
    title: string,
    error?: string,
    errorType?: string
}

export function getLinkInfo(getDocFromAlias:any, encodeCodeBlock:any, log:winston.Logger): Function {
    return function getLinkInfoImpl( url:string, title:string, currentDoc:Document) {
        let linkInfo: LinkInfo = {
            url: url,
            type: 'url',
            valid: true,
            title: title || url
        };    

        if ( !url ) {
        throw new Error('Invalid url');
        }
    
        let hasParenthesis:boolean = false;

        if (url.slice(-2) === "()"){
            url = url.slice(0, -2);
            hasParenthesis = true;
        }

        var docs = getDocFromAlias(url, currentDoc);

        let isProperty = (docs[0] instanceof PropertyMemberDoc)
        
        // @ts-ignore
        if ( !getLinkInfoImpl.useFirstAmbiguousLink && docs.length > 1 ) {
    
        linkInfo.valid = false;
        linkInfo.errorType = 'ambiguous';
        linkInfo.error = 'Ambiguous link: "' + url + '".\n' +
            docs.reduce(function(msg: string, doc: Document) { return msg + '\n  "' + doc.id + '" ('+ doc.docType + ') : (' + doc.path + ' / ' + doc.fileInfo.relativePath + ')'; }, 'Matching docs: ');
    
        } else if ( docs.length >= 1 && !isProperty) {
    
        linkInfo.url = docs[0].path;
        linkInfo.title = title || encodeCodeBlock(docs[0].name, true);
        linkInfo.type = 'doc';
    
        // @ts-ignore
        if ( getLinkInfoImpl.relativeLinks && currentDoc && currentDoc.path ) {
            var currentFolder = path.dirname(currentDoc.path);
            var docFolder = path.dirname(linkInfo.url);
            var relativeFolder = path.relative(path.join('/', currentFolder), path.join('/', docFolder));
            linkInfo.url = path.join(relativeFolder, path.basename(linkInfo.url));
            log.debug(currentDoc.path, docs[0].path, linkInfo.url);
        }
    
        } else if ( url.indexOf('#') > 0 ) {
        var pathAndHash = url.split('#');
        linkInfo = getLinkInfoImpl(pathAndHash[0], title, currentDoc);
        linkInfo.url = linkInfo.url + '#' + pathAndHash[1];
        if (hasParenthesis && !isProperty) url += "()";
        linkInfo.title = encodeCodeBlock(url, true)
        return linkInfo;
    
        } else if ( url.indexOf('.') > 0 ) {
        var pathAndDot = url.split('.');
        linkInfo = getLinkInfoImpl(pathAndDot[0], title, currentDoc);
        linkInfo.url = linkInfo.url + '#' + pathAndDot[1];
        if (hasParenthesis && !isProperty) url += "()";
        linkInfo.title = encodeCodeBlock(url, true, null, !isProperty)
        return linkInfo;
        } else if ( url.indexOf('/') === -1 && url.indexOf('.') !== 0 ) {
    
        linkInfo.valid = false;
        linkInfo.errorType = 'missing';
        linkInfo.error = 'Invalid link (does not match any doc): "' + url + '"';
    
        } else {
    
        linkInfo.title = title || (( url.indexOf('#') === 0 ) ? url.substring(1) : path.basename(url, '.html'));
    
        }
    
        return linkInfo;
    };
}
