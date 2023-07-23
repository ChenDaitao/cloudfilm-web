import { ref, watch } from "vue";
const noop = () => {};

export type CountingDown = {
  time?: number; //计时时间 (单位/s)
  stop?: typeof noop; //计数完成时回调
};
type Interval = ReturnType<typeof setInterval>;

const defaultCountingDown: CountingDown = {
  time: 60,
  stop: noop,
};

/**
 * @description: 处理倒计时计数
 * @param {CountingDown} options
 * @return {*}
 */
export const countingDown = (options: CountingDown = defaultCountingDown) => {
  const {
    time = defaultCountingDown.time as number,
    stop = defaultCountingDown.stop as typeof noop,
  } = options;

  const timeCount = ref(time); // 当前计数
  const isStop = ref(true); //是否暂停计数
  let intervalTimer: Interval | null = null;

  function updateCounting() {
    if (timeCount.value === 0) {
      isStop.value = true;
      stop();
      clearInterval(intervalTimer as Interval);
    } else {
      isStop.value = false; //开始计时
      timeCount.value--;
    }
  }

  function runInterval() {
    intervalTimer = setInterval(updateCounting, 1000);
  }

  const start = () => {
    timeCount.value = time + 1; //先执行一次计数 目的：显示时可以显示最大数据的timeCount （而且setInterval是1s之后触发）
    updateCounting();
    runInterval();
  };

  // watch(
  //   isStop,
  //   (val: boolean) => {
  //     if (val === false) start();
  //   },
  //   {
  //     immediate: true,
  //   }
  // );
  return { isStop, timeCount, start };
};
