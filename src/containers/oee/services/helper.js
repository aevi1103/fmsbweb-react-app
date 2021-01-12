export const startConnection = (conn, line, onChange, onJoin, onLeave, onError) => {

    const joinStyle = 'color: green; font-size: 15px; font-weight: bold;'
    const leaveStyle = 'color: red; font-size: 15px; font-weight: bold;'

    if (conn && line && conn.state === 'Disconnected') {

        conn.start()
            .then(() => {

                //* add client to group
                conn.invoke('AddToGroup', line.tagName)

                //* listner
                conn.on('BroadCastChange', data => {

                    if (onChange === 'function') {
                        onChange();
                    }
                    
                });

                conn.on('onJoin', data => {

                    if (!onJoin) {
                        console.log(`%c counter join: ${data}`, joinStyle)
                    }

                    if (onJoin === 'function') {
                        onJoin();
                    }
                    
                });

                conn.on('onLeave', data => {

                    if (!onLeave) {
                        console.log(`%c counter leave: ${data}`, leaveStyle)
                    }

                    if (onLeave === 'function') {
                        onLeave();
                    }
                    
                });
            })
            .catch(error => {

                if (onError === 'function') {
                    onError(error);
                }

            })
    }

}