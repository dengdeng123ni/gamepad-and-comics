// @ts-nocheck
import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ContextMenuControllerService } from '../context-menu/context-menu-controller.service';
import { GamepadEventService } from './gamepad-event.service';
import { GamepadInputService } from './gamepad-input.service';
import { Subject } from 'rxjs';
import { GamepadSoundService } from './gamepad-sound.service';
import { GamepadVoiceService } from './gamepad-voice.service';
import { KeyboardEventService } from './keyboard-event.service';
declare const document: any;
// Define an enum to hold the possible directions
// Define a type for the options object passed to scrollIntoView
type ScrollOptions = {
  behavior: "smooth";
  block?: "start" | "end" | "nearest";
  inline?: "start" | "end" | "nearest";
};
@Injectable({
  providedIn: 'root'
})
export class GamepadControllerService {
  constructor(
    public GamepadInput: GamepadInputService,
    public GamepadEvent: GamepadEventService,
    public ContextMenuController: ContextMenuControllerService,
    public GamepadSound: GamepadSoundService,
    public GamepadVoice: GamepadVoiceService,
    public KeyboardEvent: KeyboardEventService,

    private zone: NgZone,
    private router: Router
  ) {
    if (localStorage.getItem('is_voice_controller') == "open") this.is_voice_controller = true;

  }

  init() {
    this.GamepadInput.down().subscribe((x: string) => {
      document.body.setAttribute("pattern", "gamepad")
      this.device(x);
    })
    this.GamepadInput.up().subscribe((x: string) => {
      if (x == "Y") this.Y = false;
    })
    this.GamepadInput.press().subscribe((e: string) => {
      if (["UP", "DOWN", "LEFT", "RIGHT", "LEFT_BUMPER", "RIGHT_BUMPER","LEFT_ANALOG_DOWN",
      "LEFT_ANALOG_RIGHT",
      "RIGHT_ANALOG_DOWN",
      "RIGHT_ANALOG_RIGHT",
      "DPAD_DOWN",
      "DPAD_RIGHT",
      "LEFT_ANALOG_LEFT",
      "LEFT_ANALOG_UP",
      "RIGHT_ANALOG_LEFT",
      "RIGHT_ANALOG_UP",
      "DPAD_LEFT",
      "DPAD_UP"].includes(e)) {
        this.device(e);
      }
    });


    let config = {
      attributes: true, //目标节点的属性变化
      childList: false, //目标节点的子节点的新增和删除
      characterData: false, //如果目标节点为characterData节点(一种抽象接口,具体可以为文本节点,注释节点,以及处理指令节点)时,也要观察该节点的文本内容是否发生变化
      subtree: false, //目标节点所有后代节点的attributes、childList、characterData变化
    };
    this.KeyboardEvent.registerGlobalEvent({
      "Enter": () => { this.GamepadInput.down$.next("A") },
      "Escape": () => { this.GamepadInput.down$.next("B") },
    })
    // let observe = new MutationObserver(() => this.execute());
    // observe.observe(document, config);
    // this.execute()
    this.router.events.subscribe((event) => {
      // NavigationEnd,NavigationCancel,NavigationError,RoutesRecognized
      if (event instanceof NavigationStart) {
        this.current = null;
      }
    })

    this.GamepadEvent.registerGlobalEvent({
      "A": () => this.leftKey(),
      "X": () => this.rightKey(),
      "UP": () => this.setCurrentTarget("UP"),
      "DOWN": () => this.setCurrentTarget("DOWN"),
      "RIGHT": () => this.setCurrentTarget("RIGHT"),
      "LEFT": () => this.setCurrentTarget("LEFT"),
      LEFT_BUMPER: () => {
        this.setMoveTargetPrevious();
      },
      RIGHT_BUMPER: () => {
        this.setMoveTargetNext();
      },
      START: () => {
        this.isGamepadExplanationComponent = !this.isGamepadExplanationComponent;
      }
    })
    this.GamepadEvent.registerGlobalEventY({
      LEFT_BUMPER: () => {
        this.setMoveTargetFirst();
      },
      RIGHT_BUMPER: () => {
        this.setMoveTargetLast();
      },
    })
    this.GamepadEventBefore$.subscribe((x: any) => {

      this.GamepadSound.device(x.input, x.node, x.region, x.index)
    })
    this.EegionBefore$.subscribe(x => {

    })
  }
  runs = [];
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }

  async execute() {
    // 检查是否符合执行条件
    if (document.body.getAttribute("pattern") !== "gamepad") return;
    // 防止并发执行
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      await this.getNodes();
      await this.sleep(500);
      this.execute();
    } finally {
      // 清理状态，以便下次执行
      this.isRunning = false;
    }
  }
  Y = false;

  private GamepadEventBefore$ = new Subject();
  private GamepadEventAfter$ = new Subject();
  private EegionBefore$ = new Subject();
  private nodes = [];
  private list = [];

  current = null;
  pause = false;

  isGamepadExplanationComponent = false;
  is_voice_controller = false;

  is_when_inputting=false;
  device(input: string) {
    let is_11=["LEFT_ANALOG_DOWN",
    "LEFT_ANALOG_RIGHT",
    "RIGHT_ANALOG_DOWN",
    "RIGHT_ANALOG_RIGHT",
    "DPAD_DOWN",
    "DPAD_RIGHT",
    "LEFT_ANALOG_LEFT",
    "LEFT_ANALOG_UP",
    "RIGHT_ANALOG_LEFT",
    "RIGHT_ANALOG_UP",
    "DPAD_LEFT",
    "DPAD_UP"].includes(input);
    if (document.visibilityState === "hidden" || this.pause) return;
    if (input === "Y") this.Y = true;
    if(!is_11) this.getCurrentTarget();

    if(!is_11) this.GamepadEventBefore$.next({ input: input, node: this.nodes[this.current.index], region: this.current.region, index: this.current.index });

    const region = this.current.region;

    this.zone.run(() => {
      if (this.Y) {
        if (this.GamepadEvent.areaEventsY[region]?.[input]) {
          this.GamepadEvent.areaEventsY[region][input](this.nodes[this.current.index]);
        } else if (this.GamepadEvent.globalEventsY[input]) {
          this.GamepadEvent.globalEventsY[input](this.nodes[this.current.index]);
        }
      } else {
        if (this.GamepadEvent.areaEvents[region]?.[input]) {
          this.GamepadEvent.areaEvents[region][input](this.nodes[this.current.index]);
        } else if (this.GamepadEvent.globalEvents[input]) {
          this.GamepadEvent.globalEvents[input](this.nodes[this.current.index]);
        }
      }
    })
    if (!this.current) return
    if(!is_11) this.GamepadEventAfter$.next({ input: input, node: this.nodes[this.current.index], region: this.current.region });
  }
  device2(input: string) {
    if(this.is_when_inputting){
      if(input=="Enter"){

      }else if(input=="Escape"){

      }else{
        return null
      }
    }
    this.getCurrentTarget();
    const region = this.current.region;
    if("Meta"==input) this.Y=true;

    if (this.Y) {
      if (this.KeyboardEvent?.areaEventsY[region]?.[input]) {
        return this.KeyboardEvent.areaEventsY[region][input](this.nodes[this.current.index]);
      } else if (this.KeyboardEvent.globalEventsY[input]) {
        this.KeyboardEvent.globalEventsY[input](this.nodes[this.current.index]);
        return false
      } else {
        return true
      }
    } else {
      if (this.KeyboardEvent.areaEvents[region]?.[input]) {
        return this.KeyboardEvent.areaEvents[region][input](this.nodes[this.current.index]);
      } else if (this.KeyboardEvent.globalEvents[input]) {
        this.KeyboardEvent.globalEvents[input](this.nodes[this.current.index]);
        return false
      } else {
        return true
      }
    }
  }
  setMoveTargetPrevious() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    let nodePrevious = node.previousElementSibling;
    if (!nodePrevious || nodePrevious && !nodePrevious.getAttribute("region")) {
      const firstNode = document.querySelectorAll(`[region=${region}]`)[0]
      if (node.isSameNode(firstNode)) return
      const { node: leftNode } = this.getMoveTarget("LEFT");
      const { node: upNode } = this.getMoveTarget("UP");
      if (!node.isSameNode(leftNode) && leftNode.getAttribute("region") == region) {
        nodePrevious = leftNode;
      } else if (!node.isSameNode(upNode) && upNode.getAttribute("region") == region) {
        nodePrevious = upNode;
      } else {
        return
      }
    }
    if (!nodePrevious) return
    if (!nodePrevious.getAttribute("region") == region) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodePrevious);
    this.setupHoverObserver(nodePrevious)
    nodePrevious.setAttribute("select", "true");
    this.scrollToElement(nodePrevious, "UP");
  }
  setMoveTargetNext() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    let nodeNext = node.nextElementSibling;
    if (!nodeNext || nodeNext && !nodeNext.getAttribute("region")) {
      const nodes = document.querySelectorAll(`[region=${region}]`)
      const lastNode = nodes[nodes.length - 1]
      if (node.isSameNode(lastNode)) return
      const { node: rightNode } = this.getMoveTarget("RIGHT");
      const { node: downNode } = this.getMoveTarget("DOWN");
      if (!node.isSameNode(rightNode) && rightNode.getAttribute("region") == region) {
        nodeNext = rightNode;
      } else if (!node.isSameNode(downNode) && downNode.getAttribute("region") == region) {
        nodeNext = downNode;
      } else {
        return
      }
    }
    if (!nodeNext) return
    if (!nodeNext.getAttribute("region") == region) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeNext);
    this.setupHoverObserver(nodeNext)
    nodeNext.setAttribute("select", "true");
    this.scrollToElement(nodeNext, "DOWN");
  }
  setMoveTargetFirst() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    const nodes = document.querySelectorAll(`[region=${region}]`)
    const nodeFirst = nodes[0]
    if (!nodeFirst) return
    if (!nodeFirst.getAttribute("region") == node.getAttribute("region")) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeFirst);
    this.setupHoverObserver(nodeFirst)
    nodeFirst.setAttribute("select", "true");
    this.scrollToElement(nodeFirst, "DOWN");
  }
  setMoveTargetLast() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    const nodes = document.querySelectorAll(`[region=${region}]`)
    const nodeLast = nodes[nodes.length - 1]
    if (!nodeLast) return
    if (!nodeLast.getAttribute("region") == node.getAttribute("region")) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeLast);
    this.setupHoverObserver(nodeLast)
    nodeLast.setAttribute("select", "true");
    this.scrollToElement(nodeLast, "DOWN");
  }
  // document.querySelector("#section_item_1679231989932").
  getCurrentObj(node) {
    const position = node.getBoundingClientRect();
    return { id: node.getAttribute("_id"), index: 0, select: node.getAttribute("select") == "true", start: node.getAttribute("select") == "true", region: node.getAttribute("region"), position }
  }
  oldRegion = null;

  async getNodes() {
    const region = document.body.getAttribute("locked_region");
    if (!region) {
      this.setDefaultRegion();
      return
    }
    this.nodes = document.querySelectorAll(this.GamepadEvent.configs[region].queryStr);

    if (this.oldRegion != region) {
      this.oldRegion = region;
      this.EegionBefore$.next(region)
    }
    let list = [];
    let index = 0;
    for (let node of this.nodes) {
      const position = node.getBoundingClientRect();
      list.push({ id: node.getAttribute("_id"), index: index, select: node.getAttribute("select") == "true", start: node.getAttribute("select") == "true", region: node.getAttribute("region"), position });
      index++;
    }
    this.list = list;
  }
  async getNodes2() {
    const region = document.body.getAttribute("locked_region");
    if (!region) {
      this.setDefaultRegion();
      return
    }
    const nodes = document.querySelectorAll(this.GamepadEvent.configs[region].queryStr);

    return nodes
  }

  setDefaultRegion() {
    const router = document.body.getAttribute("router");
    if (router) {
      document.body.setAttribute("locked_region", router);
    } else {
      if (this.router.url.split("/")[1] == "") {
        document.body.setAttribute("router", "list")
        document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        return
      }
      if (this.router.url.split("/")[1] == "detail") {
        document.body.setAttribute("router", "detail")
        document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        return
      }
      document.body.setAttribute("router", "reader")
      document.body.setAttribute("locked_region",document.body.getAttribute("router"))
    }
  }

  getCurrentNode = () => {
    let current = null;
    current = this.list.find(x => x.select == true);
    if (!current) current = this.list.find(x => x.start == true);
    if (!current) current = this.list[0];
    if (!current) return
    return this.nodes[current.index]
  };
  getCurrentTarget() {
    this.getNodes();
    this.current = this.list.find(x => x.select == true);
    if (!this.current) this.current = this.list.find(x => x.start == true);
    if (!this.current) this.current = this.list[0];
    if (!this.current) { this.setDefaultRegion(); this.getNodes(); this.getCurrentTarget(); }
  }

  getMoveTarget(direction) {
    const current = this.current;
    const filters = {
      "UP": (x) => x.position.y < current.position.y,
      "DOWN": (x) => x.position.y > current.position.y,
      "LEFT": (x) => x.position.x < current.position.x && current.position.y == x.position.y,
      "RIGHT": (x) => x.position.x > current.position.x && current.position.y == x.position.y,
    }
    let shortests = this.list.filter(x => filters[direction](x) && x.region == current.region);
    if (shortests.length == 0) {
      const filters = {
        "UP": (x) => x.position.y < current.position.y,
        "DOWN": (x) => x.position.y > current.position.y,
        "LEFT": (x) => x.position.x < current.position.x,
        "RIGHT": (x) => x.position.x > current.position.x,
      }
      shortests = this.list.filter(x => filters[direction](x));
    }
    const nearest = shortests.reduce((closest, x) => {
      const dist = Math.hypot(current.position.x - x.position.x, current.position.y - x.position.y);
      return dist < closest.dist ? { node: x, dist: dist } : closest;
    }, { node: null, dist: Infinity }).node;
    const i = nearest ? nearest.index : current.index; //如果没有找到最近的节点，则使用最近的索引或当前索引
    return {
      current: this.list[i], node: this.nodes[i]
    }
  }
  getMoveTargetOther(direction) {
    const current = this.current;
    let shortests = [];
    if (shortests.length == 0) {
      const filters = {
        "UP": (x) => x.position.y < current.position.y && x.region != current.region,
        "DOWN": (x) => x.position.y > current.position.y && x.region != current.region,
        "LEFT": (x) => x.position.x < current.position.x && x.region != current.region,
        "RIGHT": (x) => x.position.x > current.position.x && x.region != current.region,
      }
      shortests = this.list.filter(x => filters[direction](x));
    }
    const nearest = shortests.reduce((closest, x) => {
      const dist = Math.hypot(current.position.x - x.position.x, current.position.y - x.position.y);
      return dist < closest.dist ? { node: x, dist: dist } : closest;
    }, { node: null, dist: Infinity }).node;
    const i = nearest ? nearest.index : current.index; //如果没有找到最近的节点，则使用最近的索引或当前索引
    return {
      current: this.list[i], node: this.nodes[i]
    }
  }

  delSelectTarget() {
    // this.nod
    // document.querySelectorAll("[select=true]").forEach(element => {
    //   element.removeAttribute("select");
    // });
    this.list.filter(x => x.select == true).forEach(x => this.nodes[x.index].removeAttribute("select"));
  }
  setCurrentTarget(direction: string) {
    this.delSelectTarget();
    const { current, node } = this.getMoveTarget(direction);
    this.current = current;
    this.setupHoverObserver(node)
    node.setAttribute("select", "true");
    this.scrollToElement(node, (direction as any));
  }
  setCurrentRegionTarget(direction: string) {
    const { current, node } = this.getMoveTarget(direction);
    if (current.region == this.current.region) {
      this.delSelectTarget();
      this.current = current;
      this.setupHoverObserver(node)
      node.setAttribute("select", "true");
      this.scrollToElement(node, (direction as any));
    }
  }
  setOtherRegionTarget(direction: string) {
    const { current, node } = this.getMoveTargetOther(direction);
    this.delSelectTarget();
    this.current = current;
    this.setupHoverObserver(node)
    node.setAttribute("select", "true");
    this.scrollToElement(node, (direction as any));
  }
  setupHoverObserver(node) {
    const config = { attributes: true, childList: false, characterData: false, subtree: false };
    let isHovering = false;
    const observe = new MutationObserver((mutations) => {
      const { target } = mutations[0];
      if (node.getAttribute("select") === "true") {
        if (!this.current || this.current && !this.current.region) return
        if (!isHovering && this.GamepadEvent.hoverEvents[this.current.region]?.ENTER) {
          this.GamepadEvent.hoverEvents[this.current.region].ENTER(target);
          isHovering = true;
        }
      } else {
        if (!this.current || this.current && !this.current.region) return
        if (isHovering && this.GamepadEvent.hoverEvents[this.current.region]?.LEAVE) {
          this.GamepadEvent.hoverEvents[this.current.region].LEAVE(target);
          isHovering = false;
          observe.disconnect();
        }
      }
    });
    observe.observe(node, config);
  }

  setCurrentTargetId(id, isMove = true) {
    this.delSelectTarget();
    let i = this.list.findIndex(x => x.id == id)
    if (i > -1) {
      const node = this.nodes[i];
      this.current = this.list[i];
      this.setupHoverObserver(node)
      node.setAttribute("select", "true");

      if (isMove) this.scrollToElement(node, "UP");
    }
  }

  scrollToElement = (element: any, direction: string) => {
    let observer = new IntersectionObserver(
      changes => {
        changes.forEach(x => {
          if (x.intersectionRatio != 1) {
            const funs = {
              "UP": () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
              "LEFT": () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
              "RIGHT": () => element.scrollIntoView({ behavior: "smooth", block: "end" }),
              "DOWN": () => element.scrollIntoView({ behavior: "smooth", block: "end" })
            }
            funs[direction]();

          }
          observer.unobserve(element);
        });
      }
    );
    observer.observe(element);
  }
  GamepadEventBefore = () => this.GamepadEventBefore$

  GamepadEventAfter = () => this.GamepadEventAfter$

  EegionBefore = () => this.EegionBefore$

  leftKey = () => {
    const node = this.nodes[this.current.index];

    const type = node.getAttribute("type")
    if (type == 'chip' || type == 'slide') {
      node.querySelector("button").click();
    } else if (type == 'radio') {
      node.querySelector("input").click();
    } else if (type == 'checkbox') {
      node.querySelector("[type=checkbox]").click();
    } else {
      node.click();
    }
  }
  rightKey() {
    const index = this.current.index;
    const currentPosition = this.nodes[index].getBoundingClientRect();
    let x = parseInt(currentPosition.x + currentPosition.width * 0.7)
    let y = parseInt(currentPosition.y + currentPosition.height * 0.7)
    this.ContextMenuController.openContextMenu(this.nodes[index], x, y)
  }
  getHandelState = () => this.GamepadInput.getState()
  setMoveEventRegister(name, obj) {
    this.GamepadEvent.registerAreaEvent(name,
      {
        "UP": () => {
          const state = this.getHandelState();
          if (state.LEFT_ANALOG_UP) obj.LEFT_ANALOG_UP(state);
          else if (state.DPAD_UP) obj.DPAD_UP(state);
          else if (state.RIGHT_ANALOG_UP) obj.RIGHT_ANALOG_UP(state);
        },
        "DOWN": () => {
          const state = this.getHandelState();
          if (state.LEFT_ANALOG_RIGHT) obj.LEFT_ANALOG_RIGHT(state);
          else if (state.DPAD_RIGHT) obj.DPAD_RIGHT(state);
          else if (state.RIGHT_ANALOG_RIGHT) obj.RIGHT_ANALOG_RIGHT(state);
        },
        "RIGHT": () => {
          const state = this.getHandelState();
          if (state.LEFT_ANALOG_DOWN) obj.LEFT_ANALOG_DOWN(state);
          else if (state.DPAD_DOWN) obj.DPAD_DOWN(state);
          else if (state.RIGHT_ANALOG_DOWN) obj.RIGHT_ANALOG_DOWN(state);
        },
        "LEFT": () => {
          const state = this.getHandelState();
          if (state.LEFT_ANALOG_LEFT) obj.LEFT_ANALOG_LEFT(state);
          else if (state.DPAD_LEFT) obj.DPAD_LEFT(state);
          else if (state.RIGHT_ANALOG_LEFT) obj.RIGHT_ANALOG_LEFT(state);
        },
      })
  }

  getAngle = (x, y): number => {
    x = parseFloat(x);
    y = parseFloat(y);
    var a = Math.atan2(y, x);
    var ret = a * 180 / Math.PI; //弧度转角度，方便调试
    if (ret > 360) {
      ret -= 360;
    }
    if (ret < 0) {
      ret += 360;
    }
    ret += 90;
    if (ret > 360) {
      ret -= 360
    }
    return ret;
  }
}
