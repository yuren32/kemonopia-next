'use client';// クライアントサイドでのみ実行されるコードであることを示します

// react-hot-toastライブラリにインスパイアされたコード
// Inspired by react-hot-toast library
import * as React from 'react';// Reactライブラリをインポート

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';// ToastActionElementとToastProps型をインポート

const TOAST_LIMIT = 1;// 同時に表示できるトーストの最大数を1に設定
const TOAST_REMOVE_DELAY = 1000000;// トーストが削除されるまでの遅延時間を設定（ミリ秒）

// ToasterToast型を定義。ToastPropsに加えて、id、title、description、actionプロパティを持つ
type ToasterToast = ToastProps & {
  id: string; // トーストの一意の識別子
  title?: React.ReactNode;// トーストのタイトル（オプション）
  description?: React.ReactNode;// トーストの説明（オプション）
  action?: ToastActionElement;// トーストに関連するアクション（オプション）
};
// トーストのアクションタイプを定義
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST', // トーストを追加するアクション
  UPDATE_TOAST: 'UPDATE_TOAST', // トーストを更新するアクション
  DISMISS_TOAST: 'DISMISS_TOAST', // トーストを非表示にするアクション
  REMOVE_TOAST: 'REMOVE_TOAST', // トーストを削除するアクション
} as const; // 定数として扱う

let count = 0;// トーストの一意のIDを生成するためのカウンター

// 一意のIDを生成する関数
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER; // カウンターをインクリメントし、最大安全整数を超えないようにする
  return count.toString(); // カウンターを文字列として返す
}

type ActionType = typeof actionTypes;// アクションタイプの型を定義

// アクションの型を定義
type Action =
  | {
      type: ActionType['ADD_TOAST']; // トーストを追加するアクション
      toast: ToasterToast; // 追加するトーストのデータ
    }
  | {
    type: ActionType['UPDATE_TOAST']; // トーストを更新するアクション
    toast: Partial<ToasterToast>; // 更新するトーストの部分的なデータ
    }
  | {
    type: ActionType['DISMISS_TOAST']; // トーストを非表示にするアクション
    toastId?: ToasterToast['id']; // 非表示にするトーストのID（オプション）
   }
   | {
    type: ActionType['REMOVE_TOAST']; // トーストを削除するアクション
    toastId?: ToasterToast['id']; // 削除するトーストのID（オプション）
  };

// ステートの型を定義
interface State {
  toasts: ToasterToast[]; // トーストの配列
}

// トーストの削除タイムアウトを管理するマップ
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// トーストを削除キューに追加する関数
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;// 既にキューにある場合は何もしない
  }
  

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId); // タイムアウトが終了したらマップから削除
    dispatch({
      type: 'REMOVE_TOAST', // トーストを削除するアクションをディスパッチ
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY); // 指定された遅延時間後に実行

  toastTimeouts.set(toastId, timeout); // マップにタイムアウトを追加
};

// リデューサー関数を定義
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),// トーストを追加し、制限を超えないようにする
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t // トーストを更新
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId); // 指定されたトーストを削除キューに追加
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id); // 全てのトーストを削除キューに追加
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,// トーストを非表示にする
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],// 全てのトーストを削除
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),// 指定されたトーストを削除
      };
  }
};

const listeners: Array<(state: State) => void> = [];// ステート変更をリッスンするリスナーの配列

let memoryState: State = { toasts: [] };// メモリ内のステート

// アクションをディスパッチする関数
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action); // リデューサーを呼び出してステートを更新
  listeners.forEach((listener) => {
    listener(memoryState); // 全てのリスナーに新しいステートを通知
  });
}

type Toast = Omit<ToasterToast, 'id'>; // IDを除いたトーストの型を定義

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST', // トーストを更新するアクションをディスパッチ
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id }); // トーストを非表示にするアクションをディスパッチ

  dispatch({
    type: 'ADD_TOAST', // トーストを追加するアクションをディスパッチ
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => { // 型を明示的に指定
        if (!open) dismiss(); // トーストが閉じられたときに非表示にする
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// トーストのフックを定義
function useToast() {
  const [state, setState] = React.useState<State>(memoryState); // ステートをフックで管理

  React.useEffect(() => {
    listeners.push(setState); // リスナーにステート変更を通知する関数を追加
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1); // クリーンアップ時にリスナーを削除
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }), // トーストを非表示にする関数を返す
  };
}

export { useToast, toast }; // フックとトースト関数をエクスポート
