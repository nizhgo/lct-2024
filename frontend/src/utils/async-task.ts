/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx";

/**
 * Класс, управляющий выполнением асинхронных задач.
 * @template Fn - Функция, возвращающая Promise.
 */
export class AsyncTask<Fn extends (...args: any) => Promise<any>> {
  /**
   * @param task - Асинхронная функция, которой будет управлять класс.
   */
  constructor(private task: Fn) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  private promise: Promise<any> | null = null;
  private error: any = null;
  private result: any = null;

  /**
   * Проверяет, выполняется ли задача в данный момент.
   * @returns {boolean} - True, если задача выполняется, иначе false.
   */
  get isPending(): boolean {
    return this.promise !== null;
  }

  /**
   * Возвращает последнюю возникшую ошибку.
   * @returns {any} - Последняя ошибка.
   */
  get getError(): any {
    return this.error;
  }

  /**
   * Возвращает результат последнего успешного выполнения задачи.
   * @returns {any} - Результат последней задачи.
   */
  get getResult(): any {
    return this.result;
  }

  /**
   * Устанавливает текущий промис для задачи.
   * @param promise - Промис, который нужно установить.
   */
  private setPromise(promise: Promise<any> | null) {
    runInAction(() => {
      this.promise = promise;
    });
  }

  /**
   * Устанавливает результат и ошибку после выполнения задачи.
   * @param result - Результат задачи.
   * @param error - Ошибка, возникшая при выполнении задачи.
   */
  private setResult(result: any, error: any) {
    runInAction(() => {
      this.result = result;
      this.error = error;
    });
  }

  /**
   * Выполняет задачу с предоставленными аргументами.
   * Выбрасывает ошибку, если задача уже выполняется.
   * @param args - Аргументы для передачи в функцию задачи.
   * @returns {Promise<any>} - Промис, представляющий выполнение задачи.
   */
  execute(...args: Parameters<Fn>): Promise<any> {
    if (this.promise) throw new Error("Задача уже выполняется");

    const promise = this.task(...args);
    this.setPromise(promise);

    return promise.then(
      (result) => {
        this.setResult(result, null);
        this.setPromise(null);
        return result;
      },
      (error) => {
        this.setResult(null, error);
        this.setPromise(null);
        throw error;
      },
    );
  }

  /**
   * Повторяет задачу с предоставленными аргументами, даже если задача уже выполняется.
   * @param args - Аргументы для передачи в функцию задачи.
   * @returns {Promise<any>} - Промис, представляющий выполнение задачи.
   */
  retry(...args: Parameters<Fn>): Promise<any> {
    const promise = this.task(...args);
    this.setPromise(promise);

    return promise.then(
      (result) => {
        this.setResult(result, null);
        this.setPromise(null);
        return result;
      },
      (error) => {
        this.setResult(null, error);
        this.setPromise(null);
        throw error;
      },
    );
  }
}
