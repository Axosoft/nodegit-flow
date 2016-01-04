<a name="Base"></a>
## Base
All of this class' functions are attached to `NodeGit.Flow`

**Kind**: global class  

* [Base](#Base)
    * [.init(repo, gitflowConfig)](#Base.init) ⇒ <code>Flow</code>
    * [.isInitialized(repo)](#Base.isInitialized) ⇒ <code>Boolean</code>
    * [.open(repo)](#Base.open) ⇒ <code>Flow</code>

<a name="Base.init"></a>
### Base.init(repo, gitflowConfig) ⇒ <code>Flow</code>
Initializes the repo to use git flow

**Kind**: static method of <code>[Base](#Base)</code>  
**Returns**: <code>Flow</code> - An instance of a flow object tied to the repository  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Repository</code> | The repository to initialize git flow in |
| gitflowConfig | <code>Object</code> | The git flow configuration to use |

<a name="Base.isInitialized"></a>
### Base.isInitialized(repo) ⇒ <code>Boolean</code>
Check if the repo is using git flow

**Kind**: static method of <code>[Base](#Base)</code>  
**Returns**: <code>Boolean</code> - Whether or not the repo has git flow initialized  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Repository</code> | The nodegit repository instance to check |

<a name="Base.open"></a>
### Base.open(repo) ⇒ <code>Flow</code>
Creates a Flow instance for a repo that already has git flow initialized

**Kind**: static method of <code>[Base](#Base)</code>  
**Returns**: <code>Flow</code> - An instance of a flow object tied to the repository  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Repository</code> | The target nodegit repository |

