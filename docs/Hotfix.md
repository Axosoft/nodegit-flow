<a name="Hotfix"></a>
## Hotfix
All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object

**Kind**: global class  

* [Hotfix](#Hotfix)
    * _instance_
        * [.startHotfix(hotfixVersion, options)](#Hotfix+startHotfix) ⇒ <code>Branch</code>
        * [.finishHotfix(hotfixVersion, options)](#Hotfix+finishHotfix) ⇒ <code>Commit</code>
    * _static_
        * [.startHotfix(repo, hotfixVersion, options)](#Hotfix.startHotfix) ⇒ <code>Branch</code>
        * [.finishHotfix(repo, hotfixVersion, options)](#Hotfix.finishHotfix) ⇒ <code>Commit</code>

<a name="Hotfix+startHotfix"></a>
### hotfix.startHotfix(hotfixVersion, options) ⇒ <code>Branch</code>
Starts a git flow "hotfix"

**Kind**: instance method of <code>[Hotfix](#Hotfix)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the hotfix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| hotfixVersion | <code>String</code> | The version of the hotfix to start |
| options | <code>Object</code> | Options for start hotfix |

<a name="Hotfix+finishHotfix"></a>
### hotfix.finishHotfix(hotfixVersion, options) ⇒ <code>Commit</code>
Finishes a git flow "hotfix"

**Kind**: instance method of <code>[Hotfix](#Hotfix)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the hotfix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| hotfixVersion | <code>String</code> | The version of the hotfix to finish |
| options | <code>Object</code> | Options for finish hotfix |

<a name="Hotfix.startHotfix"></a>
### Hotfix.startHotfix(repo, hotfixVersion, options) ⇒ <code>Branch</code>
Starts a git flow "hotfix"

**Kind**: static method of <code>[Hotfix](#Hotfix)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the hotfix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to start a hotfix in |
| hotfixVersion | <code>String</code> | The version of the hotfix to start |
| options | <code>Object</code> | Options for start hotfix |

<a name="Hotfix.finishHotfix"></a>
### Hotfix.finishHotfix(repo, hotfixVersion, options) ⇒ <code>Commit</code>
Finishes a git flow "hotfix"

**Kind**: static method of <code>[Hotfix](#Hotfix)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the hotfix  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to finish a hotfix in |
| hotfixVersion | <code>String</code> | The version of the hotfix to finish |
| options | <code>Object</code> | Options for finish hotfix |

