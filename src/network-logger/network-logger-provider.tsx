// eslint-disable-next-line react-hooks/exhaustive-deps
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ModalProvider, useModal } from '../modal-provider';
import DebuggerFAB from './debugger-fab';
import { NetworkLogEntity } from './entities/network-log-entity';
import { NetworkLogListEntity } from './entities/network-log-list-entity';
import NetworkDebuggerModal from './network-debugger-modal';
interface NetworkLoggerContextProps {
  logEntity: NetworkLogListEntity;
  setLogEntity?: (logEntity: NetworkLogListEntity) => void;
}
interface NetworkLoggerProviderProps {
  axiosInstance: any;
  enableNetworkDebugger: boolean;
  children?: any;
}
const withModalProvider = (Component: any) => {
  return (props: NetworkLoggerProviderProps) => (
    <ModalProvider>
      <Component {...props} />
    </ModalProvider>
  );
};

const NetworkLoggerContext = createContext<NetworkLoggerContextProps>({
  logEntity: new NetworkLogListEntity([]),
});

// Chỉ bật ở DEV, staging hoặc development
export const NetworkLoggerProvider = withModalProvider(
  ({
    children,
    axiosInstance,
    enableNetworkDebugger = __DEV__,
  }: NetworkLoggerProviderProps) => {
    if (!enableNetworkDebugger) return;
    const [logEntity, setLogEntity] = useState(new NetworkLogListEntity([]));
    const { openModal } = useModal();
    useEffect(() => {
      const reqInterceptor = axiosInstance.interceptors.request.use(
        (config: any) => {
          try {
            const id = `${Date.now()}-${Math.random()}`;
            logEntity.addLog(
              new NetworkLogEntity({
                id,
                method: config.method?.toUpperCase() || 'GET',
                url: config.url || '',
                headers: config.headers || {},
                params: config.params || {},
                requestData: config.data,
                startTime: Date.now(),
                status: 'pending',
              })
            );

            (config as any).debugId = id;
            setLogEntity(logEntity);
            return config;
          } catch (err) {
            return config;
          }
        }
      );

      const resInterceptor = axiosInstance.interceptors.response.use(
        (response: any) => {
          try {
            logEntity.updateLog((response.config as any).debugId, {
              status: response.status,
              headers: response.headers,
              responseData: response.data,
              endTime: Date.now(),
            } as NetworkLogEntity);
            setLogEntity(logEntity);
          } catch (err) {
            console.warn('[NetworkDebugger] Response logging failed', err);
          }
          return response;
        },
        (error: any) => {
          try {
            if (error.config) {
              logEntity.updateLog((error.config as any).debugId, {
                status: error.response?.status ?? 'error',
                headers: error.response?.headers,
                responseData: error.response?.data,
                endTime: Date.now(),
              } as NetworkLogEntity);
              setLogEntity(logEntity);
            }
          } catch (err2) {
            console.warn('[NetworkDebugger] Error logging failed', err2);
          }
          return Promise.reject(error);
        }
      );
      return () => {
        axiosInstance.interceptors.request.eject(reqInterceptor);
        axiosInstance.interceptors.response.eject(resInterceptor);
      };
    }, [axiosInstance]);
    const value = useMemo(() => {
      return {
        logEntity,
        setLogEntity,
      };
    }, [logEntity, setLogEntity]);
    return (
      <NetworkLoggerContext.Provider value={value}>
        {children}
        <DebuggerFAB
          onPress={() => {
            openModal(
              <NetworkDebuggerModal
                logEntity={logEntity}
                setLogEntity={setLogEntity}
              />,
              {
                position: 'bottom',
              }
            );
          }}
        />
      </NetworkLoggerContext.Provider>
    );
  }
);

export const useNetworkLog = () => {
  const context = useContext(NetworkLoggerContext);
  return context;
};
