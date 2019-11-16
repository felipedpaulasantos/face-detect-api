const wrapAsync = function(functionToWrap: any) {
    return function(req: any, res: any, next: any) {
        functionToWrap(req, res, next).catch(next);
    }
}  

export { wrapAsync };