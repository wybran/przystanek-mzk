class Timestamp {
    timestampToTime(timestamp: any) {
        return new Date(timestamp).toLocaleTimeString()
    }
}
export default new Timestamp();
  