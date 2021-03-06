define(["require", "exports", './EditorPosition'], function(require, exports, __EditorPositionModule__) {
    var EditorPositionModule = __EditorPositionModule__;

    var CompilationService = (function () {
        function CompilationService(editor, ServiceShim) {
            this.editor = editor;
            this.ServiceShim = ServiceShim;
            this.editorPos = new EditorPositionModule.EditorPosition(editor);
        }
        CompilationService.prototype.getCompilation = function (script, charpos, isMemberCompletion) {
            var compInfo;
            compInfo = this.ServiceShim.languageService.getCompletionsAtPosition(script, charpos, isMemberCompletion);
            return compInfo;
        };
        CompilationService.prototype.getCursorCompilation = function (script, cursor) {
            var isMemberCompletion, matches, pos, text;
            pos = this.editorPos.getPositionChars(cursor);
            text = this.editor.session.getLine(cursor.row).slice(0, cursor.column);
            isMemberCompletion = false;
            matches = text.match(/\.([a-zA-Z_0-9\$]*$)/);
            if(matches && matches.length > 0) {
                this.matchText = matches[1];
                isMemberCompletion = true;
                pos -= this.matchText.length;
            } else {
                matches = text.match(/[a-zA-Z_0-9\$]*$/);
                this.matchText = matches[0];
            }
            return this.getCompilation(script, pos, isMemberCompletion);
        };
        CompilationService.prototype.getCurrentPositionCompilation = function (script) {
            return this.getCursorCompilation(script, this.editor.getCursorPosition());
        };
        return CompilationService;
    })();
    exports.CompilationService = CompilationService;    
})
