import { takeLatest, select, call, put, delay } from 'redux-saga/effects';
import * as testData from './testData.json';
import mySaga, {
  fetchMasterNodes,
  createMasterNodes,
  masterNodeResign,
  checkMasterNodeOwnerInfo,
  handleRestartNode,
  getConfigurationDetails,
} from '../saga';
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeSuccess,
  createMasterNodeFailure,
  resignMasterNode,
  resignMasterNodeSuccess,
  resignMasterNodeFailure,
  setMasterNodeOwnerSuccess,
  setMasterNodeOwnerError,
  finishRestartNodeWithMasterNode,
} from '../reducer';
import * as service from '../service';
import { dispatchedFunc, mockAxios } from '../../../utils/testUtils/mockUtils';
import * as electronFunc from '../../../utils/isElectron';
import { restartModal } from '../../ErrorModal/reducer';
import q from '../../../worker/queue';

const errorObj = {
  message: 'error occurred',
};

describe('Console page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchMasternodesRequest action and call fetchDataForQuery method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchMasternodesRequest.type, fetchMasterNodes)
    );
  });

  it('should wait for every fetchMasternodesRequest action and call fetchDataForQuery method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(createMasterNode.type, createMasterNodes)
    );
  });

  it('should wait for every fetchMasternodesRequest action and call fetchDataForQuery method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(resignMasterNode.type, masterNodeResign)
    );
  });

  describe('fetchDataForQuery method', () => {
    let handelFetchMasterNodes;
    beforeEach(() => {
      handelFetchMasterNodes = jest.spyOn(service, 'handelFetchMasterNodes');
    });
    afterEach(() => {
      handelFetchMasterNodes.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handelFetchMasterNodes.mockImplementation(() =>
        Promise.resolve(testData.fetchMasternodesSuccess)
      );
      const dispatched = await dispatchedFunc(fetchMasterNodes);
      expect(handelFetchMasterNodes).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchMasternodesSuccess({
          masternodes: testData.fetchMasternodesSuccess,
        }),
      ]);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handelFetchMasterNodes.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchMasterNodes);
      expect(handelFetchMasterNodes).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchMasternodesSuccess({
          masternodes: [],
        }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handelFetchMasterNodes.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchMasterNodes);
      expect(handelFetchMasterNodes).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchMasternodesFailure(errorObj.message)]);
    });
  });

  describe('createMasterNodes method', () => {
    let handelCreateMasterNodes;
    const masterNodeName = 'TestMasterNode';
    beforeEach(() => {
      handelCreateMasterNodes = jest.spyOn(service, 'handelCreateMasterNodes');
    });
    afterEach(() => {
      handelCreateMasterNodes.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handelCreateMasterNodes.mockImplementation(() =>
        Promise.resolve(testData.saga.handelCreateMasterNodes)
      );
      const dispatched = await dispatchedFunc(createMasterNodes, {
        payload: { masterNodeName },
      });
      expect(handelCreateMasterNodes).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        createMasterNodeSuccess(testData.saga.handelCreateMasterNodes),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handelCreateMasterNodes.mockImplementation(() =>
        Promise.reject(errorObj)
      );
      const dispatched = await dispatchedFunc(createMasterNodes, {
        payload: { masterNodeName },
      });
      expect(handelCreateMasterNodes).toBeCalledTimes(1);
      expect(dispatched).toEqual([createMasterNodeFailure(errorObj.message)]);
    });
  });

  describe('masterNodeResign method', () => {
    let handleResignMasterNode;
    const masterNodeHash = 'TestMasterNodeHash';
    beforeEach(() => {
      handleResignMasterNode = jest.spyOn(service, 'handleResignMasterNode');
    });
    afterEach(() => {
      handleResignMasterNode.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleResignMasterNode.mockImplementation(() =>
        Promise.resolve(testData.saga.handleResignMasterNode)
      );
      const dispatched = await dispatchedFunc(masterNodeResign, {
        payload: { masterNodeHash },
      });
      expect(handleResignMasterNode).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        resignMasterNodeSuccess(testData.saga.handleResignMasterNode),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleResignMasterNode.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(masterNodeResign, {
        payload: { masterNodeHash },
      });
      expect(handleResignMasterNode).toBeCalledTimes(1);
      expect(dispatched).toEqual([resignMasterNodeFailure(errorObj.message)]);
    });
  });

  describe('checkMasterNodeOwnerInfo method', () => {
    let getAddressInfo;
    const masterNodeOwner = 'TestMasterNodeOwner';
    beforeEach(() => {
      getAddressInfo = jest.spyOn(service, 'getAddressInfo');
    });
    afterEach(() => {
      getAddressInfo.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      getAddressInfo.mockImplementation(() =>
        Promise.resolve(testData.saga.getAddressInfo)
      );
      const dispatched = await dispatchedFunc(checkMasterNodeOwnerInfo, {
        payload: { masterNodeOwner },
      });
      expect(getAddressInfo).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        setMasterNodeOwnerSuccess(
          testData.saga.getAddressInfo.ismine &&
            !testData.saga.getAddressInfo.iswatchonly
        ),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      getAddressInfo.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(checkMasterNodeOwnerInfo, {
        payload: { masterNodeOwner },
      });
      expect(getAddressInfo).toBeCalledTimes(1);
      expect(dispatched).toEqual([setMasterNodeOwnerError(errorObj.message)]);
    });
  });

  describe('Restart node', () => {
    let genObject;
    let getAddressInfo;
    let restartNode;
    let isElectron;
    beforeEach(() => {
      genObject = handleRestartNode();
      getAddressInfo = jest.spyOn(service, 'getAddressInfo');
      isElectron = jest.spyOn(electronFunc, 'isElectron');
      restartNode = jest.spyOn(electronFunc, 'restartNode');
    });
    afterEach(() => {
      getAddressInfo.mockRestore();
      isElectron.mockRestore();
      restartNode.mockRestore();
    });

    it('should check for genObj', async () => {
      isElectron.mockImplementation(() => Promise.resolve(true));
      restartNode.mockImplementation(() => Promise.resolve(true));
      const setterObj: any = {
        createdMasterNodeData: {
          masternodeOperator: 'test_masternodeOperator',
          masternodeOwner: 'test_masternodeOwner',
        },
        ismine: true,
        iswatchonly: false,
      };
      expect(JSON.stringify(genObject.next().value)).toEqual(
        JSON.stringify(select((state) => state.masterNodes))
      );
      const getAddressInfoService = genObject.next(setterObj).value;
      expect(getAddressInfoService).toEqual(
        call(getAddressInfo, setterObj.createdMasterNodeData.masternodeOperator)
      );
      expect(genObject.next(setterObj).value).toEqual(
        call(getConfigurationDetails)
      );
      expect(genObject.next(setterObj).value).toEqual(put(restartModal()));
      expect(genObject.next().value).toEqual(call(q.kill));
      expect(genObject.next().value).toEqual(
        call(restartNode, { updatedConf: setterObj })
      );
      expect(genObject.next().value).toEqual(delay(2000));
      expect(genObject.next().value).toEqual(
        put(finishRestartNodeWithMasterNode())
      );
    });

    it('should check for getAddressInfo is giving error', async () => {
      isElectron.mockImplementation(() => Promise.resolve(true));
      restartNode.mockImplementation(() => Promise.resolve(true));
      const setterObj: any = {
        createdMasterNodeData: {
          masternodeOperator: 'test_masternodeOperator',
          masternodeOwner: 'test_masternodeOwner',
        },
        ismine: true,
        iswatchonly: false,
      };
      expect(JSON.stringify(genObject.next().value)).toEqual(
        JSON.stringify(select((state) => state.masterNodes))
      );
      const genObjectnext = genObject.next(setterObj).value;
      const getAddressInfoService = genObject.throw(errorObj).value;
      expect(getAddressInfoService).toEqual(
        put(createMasterNodeFailure(errorObj.message))
      );
    });

    it('should check for if is electron is false', () => {
      isElectron.mockImplementationOnce(() => false);
      restartNode.mockImplementation(() => Promise.resolve(true));
      const setterObj: any = {
        createdMasterNodeData: {
          masternodeOperator: 'test_masternodeOperator',
          masternodeOwner: 'test_masternodeOwner',
        },
        masternode_operator: 'operator',
        masternode_owner: 'owner',
      };
      expect(JSON.stringify(genObject.next().value)).toEqual(
        JSON.stringify(select((state) => state.masterNodes))
      );
      expect(genObject.next(setterObj).value).toEqual(
        put(createMasterNodeFailure('Electron app is needed for restart'))
      );
    });

    it('should check for getAddressInfo ismine and iswatchonly', async () => {
      isElectron.mockImplementation(() => Promise.resolve(true));
      restartNode.mockImplementation(() => Promise.resolve(true));
      const setterObj: any = {
        createdMasterNodeData: {
          masternodeOperator: 'test_masternodeOperator',
          masternodeOwner: 'test_masternodeOwner',
        },
        ismine: false,
        iswatchonly: false,
      };
      expect(JSON.stringify(genObject.next().value)).toEqual(
        JSON.stringify(select((state) => state.masterNodes))
      );
      const genObjectnext = genObject.next(setterObj).value;
      const getAddressInfoService = genObject.next(setterObj).value;
      expect(getAddressInfoService).toEqual(
        put(
          createMasterNodeFailure('masternodeOperator is not a part of wallet.')
        )
      );
    });
  });
});
