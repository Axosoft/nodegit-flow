<a name="Feature"></a>
## Feature
All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object

**Kind**: global class  

* [Feature](#Feature)
    * _instance_
        * [.startFeature(featureName, options)](#Feature+startFeature) ⇒ <code>Branch</code>
        * [.finishFeature(featureName, options)](#Feature+finishFeature) ⇒ <code>Commit</code>
    * _static_
        * [.startFeature(repo, featureName, options)](#Feature.startFeature) ⇒ <code>Branch</code>
        * [.finishFeature(repo, featureName, options)](#Feature.finishFeature) ⇒ <code>Commit</code>

<a name="Feature+startFeature"></a>
### feature.startFeature(featureName, options) ⇒ <code>Branch</code>
Starts a git flow "feature"

**Kind**: instance method of <code>[Feature](#Feature)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the feature  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| featureName | <code>String</code> | The name of the feature to start |
| options | <code>Object</code> | Options for start feature |


<a name="Feature+finishFeature"></a>
### feature.finishFeature(featureName, options) ⇒ <code>Commit</code>
Finishes a git flow "feature"

**Kind**: instance method of <code>[Feature](#Feature)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the feature  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| featureName | <code>String</code> | The name of the feature to finish |
| options | <code>Object</code> | Options for finish feature |

**Options**:

| Option | Type | Description |
| --- | --- | --- |
| keepBranch | Boolean | Keep the branch after merge |
| isRebase | Boolean | Use Rebase instead of merge |
| preRebaseCallback | Function | Callback that is fired before rebase occurs, only applicable if **isRebase** is truthy. If the callback returns a Promise, the **preRebaseCallback** promise must succeed before the rebase occurs. The **preRebaseCallback** is called with development branch name and the feature branch name. |
| processMergeMessageCallback | Function | Callback that is fired before merge occurs, only applicable if **isRebase** is falsy. If the callback returns a Promise, the **processMergeMessageCallback** promise must succeed before the merge occurs. The result of the **processMergeMessageCallback** must be a string or a promise that resolves to a string, as that message will be used for the merge message. the **processMergeMessageCallback** will be called with the generated merge message as a parameter. |
| postMergeCallback | Function | Callback fired after a successful merge occurs. |
| beforeRebaseFinishCallback | Function | Callback that is fired right before a rebase is finished with metadata reflecting the rebase operation in full. See [Rebase Branches](http://www.nodegit.org/api/repository/#rebaseBranches) |

<a name="Feature.startFeature"></a>
### Feature.startFeature(repo, featureName, options) ⇒ <code>Branch</code>
Starts a git flow "feature"

**Kind**: static method of <code>[Feature](#Feature)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the feature  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to start a feature in |
| featureName | <code>String</code> | The name of the feature to start |
| options | <code>Object</code> | Options for start feature |

<a name="Feature.finishFeature"></a>
### Feature.finishFeature(repo, featureName, options) ⇒ <code>Commit</code>
Finishes a git flow "feature"

**Kind**: static method of <code>[Feature](#Feature)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the feature  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to finish a feature in |
| featureName | <code>String</code> | The name of the feature to finish |
| options | <code>Object</code> | Options for finish feature |

**Options**:

| Option | Type | Description |
| --- | --- | --- |
| keepBranch | Boolean | Keep the branch after merge |
| isRebase | Boolean | Use Rebase instead of merge |
| preRebaseCallback | Function | Callback that is fired before rebase occurs, only applicable if **isRebase** is truthy. If the callback returns a Promise, the **preRebaseCallback** promise must succeed before the rebase occurs. The **preRebaseCallback** is called with development branch name and the feature branch name. |
| processMergeMessageCallback | Function | Callback that is fired before merge occurs, only applicable if **isRebase** is falsy. If the callback returns a Promise, the **processMergeMessageCallback** promise must succeed before the merge occurs. The result of the **processMergeMessageCallback** must be a string or a promise that resolves to a string, as that message will be used for the merge message. the **processMergeMessageCallback** will be called with the generated merge message as a parameter. |
| postMergeCallback | Function | Callback fired after a successful merge occurs. |
| beforeRebaseFinishCallback | Function | Callback that is fired right before a rebase is finished with metadata reflecting the rebase operation in full. See [Rebase Branches](http://www.nodegit.org/api/repository/#rebaseBranches) |
