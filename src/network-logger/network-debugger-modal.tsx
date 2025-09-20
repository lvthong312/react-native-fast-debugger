/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NetworkLogEntity } from './entities/network-log-entity';

export type NetworkDebuggerRef = {
  open: () => void;
  close: () => void;
};

const NetworkDebuggerModal = ({ logEntity, setLogEntity }: any) => {
  const [selectedLog, setSelectedLog] = useState<NetworkLogEntity | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'success' | 'failed'
  >('all');

  const renderItem = ({ item }: { item: NetworkLogEntity }) => {
    const statusColor = item.isSuccess
      ? '#4CAF50'
      : item.isFailed
        ? '#F44336'
        : item?.isPending
          ? '#FF9800'
          : 'blue';

    return (
      <TouchableOpacity
        onPress={() => setSelectedLog(item)}
        style={styles.logItem}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.url}>{item.method}</Text>
          <Text style={{ color: statusColor }}>{item.status ?? 'Pending'}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text numberOfLines={1} style={{ color: '#555' }}>
            {item.url}
          </Text>
        </ScrollView>
        <Text style={{ fontSize: 12, color: '#888' }}>
          {item.endTime ? item.endTime - item.startTime + ' ms' : '...'}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {/* Bottom sheet container */}
      <Animated.View style={[styles.sheetContainer]}>
        {/* HEADER */}
        <View style={styles.header}>
          {selectedLog ? (
            <TouchableOpacity
              onPress={() => setSelectedLog(null)}
              style={styles.backBtn}
            >
              <Text style={styles.btnText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                logEntity.clear();
                setLogEntity?.(logEntity);
              }}
              style={styles.clearBtn}
            >
              <Text style={styles.btnText}>Clear</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>
            {selectedLog ? 'Log Detail' : 'Network Debugger'}
          </Text>
        </View>

        {/* FILTER BUTTONS */}
        {!selectedLog && (
          <View style={styles.filterRow}>
            {(['all', 'pending', 'success', 'failed'] as const).map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterBtn,
                    filterStatus === status && styles.filterBtnActive,
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filterStatus === status && styles.filterTextActive,
                    ]}
                  >
                    {status.toUpperCase()} ({logEntity.logCounts[status]})
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}

        {/* CONTENT */}
        {selectedLog ? (
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            <Text style={styles.sectionLabel}>Method</Text>
            <Text style={styles.mono}>{selectedLog.method}</Text>

            <Text style={styles.sectionLabel}>URL</Text>
            <Text style={styles.mono}>{selectedLog.url}</Text>

            <Text style={styles.sectionLabel}>Status</Text>
            <Text style={styles.mono}>{selectedLog.status ?? 'Pending'}</Text>

            <Text style={styles.sectionLabel}>Time</Text>
            <Text style={styles.mono}>
              {selectedLog.endTime
                ? selectedLog.endTime - selectedLog.startTime + ' ms'
                : '...'}
            </Text>

            {selectedLog.requestData && (
              <>
                <Text style={styles.sectionLabel}>Request</Text>
                <Text style={styles.jsonBlock}>
                  {JSON.stringify(selectedLog.requestData, null, 2)}
                </Text>
              </>
            )}
            {selectedLog.responseData && (
              <>
                <Text style={styles.sectionLabel}>Response</Text>
                <Text style={styles.jsonBlock}>
                  {JSON.stringify(selectedLog.responseData, null, 2)}
                </Text>
              </>
            )}
          </ScrollView>
        ) : (
          <FlatList
            data={logEntity?.filteredLogs(filterStatus)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    height: 500,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontWeight: 'bold', fontSize: 16, flex: 1, textAlign: 'center' },
  clearBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backBtn: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  url: { fontWeight: 'bold', fontSize: 14 },
  sectionLabel: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f7f7f7',
    padding: 6,
    borderRadius: 4,
  },
  jsonBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#272822',
    color: '#f8f8f2',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#1976D2',
  },
  filterText: {
    fontWeight: 'bold',
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
  },
});

export default NetworkDebuggerModal;
