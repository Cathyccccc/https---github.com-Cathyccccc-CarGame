import {
    _decorator,
    Component, Node, Label, input, Input,
    director,
    EventKeyboard, KeyCode, Collider, ITriggerEvent, EventTouch
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    // 生命周期钩子函数
    // 获取节点位置 node.getPosition()
    // 修改节点位置 node.setPosition(x,y,z)
    // 帧时间补偿
    // 在脚本中绑定节点——@property(Node)
    //                 对象名称: Node = null
    // 导入FBX模型——title是绿色的——预制体节点 --》 上方工具栏【节点】移除当前预制件关联
    // 限制小车左右移动范围
    // 盒子碰撞器（碰撞组件）
    // 碰撞效果：刚体组件
    // 项目--项目设置--功能裁剪--3D--物理系统--内置物理系统
    // 节点下组件获取:
    // 方式一：node.getComponent(组件名)
    // 方式二：直接通过@property(组件名)获取
    // 控制2D/3D节点的显示，隐藏，销毁
    // 销毁：node.destroy()
    // 显示/隐藏：node.active = true/false

    // @property(Node)
    // P_Node: Node = null;

    @property(Node)
    C_Node: Node = null;

    // 第一种获取方式
    // P_Collider: Collider = null;
    // 第二种获取方式
    @property(Collider)
    P_Collider: Collider = null;

    @property(Node)
    Tips_Node: Node = null;

    @property(Label)
    Tips_Label: Label = null;

    @property // 可以使变量在cocos编辑器界面中显示和编辑
    Player_Speed: number = 10;

    // 左右移动方向控制
    Play_Direction = {
        left: false,
        right: false,
    }

    // 移动开关
    Move: Boolean = true;

    // 启动时执行
    start() {

    }

    // 创建时执行，通常用于事件监听
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
        // 第一种获取方式
        // this.P_Collider = this.P_Node.getComponent(Collider)
        this.P_Collider.on('onTriggerEnter', this._onTriggerEnter, this)
    }

    // 销毁时执行，通常用于清理事件监听
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this)
        this.P_Collider.off('onTriggerEnter', this._onTriggerEnter, this)
    }

    _onTriggerEnter(event: ITriggerEvent) {
        this.Tips_Node.active = true // 显示节点
        if (event.otherCollider.node.name == 'Win') {
            this.Tips_Label.string = '成功'
        } else {
            this.Tips_Label.string = '失败'
        }
        this.Move = false
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_A) {
            this.Play_Direction.left = true
        }
        if (event.keyCode === KeyCode.KEY_D) {
            this.Play_Direction.right = true
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_A) {
            this.Play_Direction.left = false
        }
        if (event.keyCode === KeyCode.KEY_D) {
            this.Play_Direction.right = false
        }
    }

    // 节点隐藏时执行
    onDisable() {

    }

    // 节点显示时执行
    onEnable() {

    }

    // 循环函数
    // 每帧执行（通常来说1秒60帧，但是会有掉帧的情况）
    update(deltaTime: number) { // deltaTime 为每一帧的时间
        if (!this.Move) return;
        const player_pos = this.node.getPosition();
        if (player_pos.z > 60) {
            this.Move = false
        }
        const c_pos = this.C_Node.getPosition();
        // 由于帧率是忽高忽低的，因此需要帧时间补偿，使其看起来是匀速的
        const speed = this.Player_Speed * deltaTime;
        if (this.Play_Direction.left && !this.Play_Direction.right) {
            player_pos.z += speed; // 向左移动
        } else if (!this.Play_Direction.left && this.Play_Direction.right) {
            player_pos.z -= speed; // 向右移动
        }
        // 限制小车左右移动最大范围（不能超出墙）
        player_pos.z = Math.max(Math.min(player_pos.z, 3), -3);
        this.node.setPosition(player_pos.x - speed, player_pos.y, player_pos.z);
        this.C_Node.setPosition(c_pos.x - speed, c_pos.y, c_pos.z)
    }

    // 延迟函数
    // 在 update 之后执行
    lateUpdate(deltaTime: number) {

    }

    New_Game(event: EventTouch, someData: number) {
        // console.log("New_Game", event, someData)

        // 方式一：
        // 1.隐藏Tips
        // 2.初始化赛车位置
        // 3.初始化相机位置
        // 4.开启移动开关
        // this.Tips_Node.active = false
        // this.node.setPosition(7.5, 0, 0)
        // this.C_Node.setPosition(42, 16, 0)
        // this.Move = true
        // 方式二：切换场景（适合小游戏重新加载场景，大型游戏不适用）
        director.loadScene("C1")
    }
}


