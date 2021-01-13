export const startConnection = (conn, line, group, onChange, onJoin, onLeave, onError) => {

    const joinStyle = 'color: green; font-size: 15px; font-weight: bold;'
    const leaveStyle = 'color: red; font-size: 15px; font-weight: bold;'

    if (conn && line && conn.state === 'Disconnected') {

        console.log(conn)

        conn.start()
            .then(() => {

                //* add client to group
                conn.invoke('AddToGroup', group)

                //* listner
                conn.on('BroadCastChange', data => {

                    console.log('on change.....', data)

                    if (onChange === 'function') {
                        // onChange(data);
                        onChange();
                    }
                    
                });

                conn.on('onJoin', data => {

                    if (!onJoin) {
                        console.log(`%c ${conn?.connection?.baseUrl} join: ${data}`, joinStyle)
                    }

                    if (onJoin === 'function') {
                        onJoin();
                    }
                    
                });

                conn.on('onLeave', data => {

                    if (!onLeave) {
                        console.log(`%c ${conn?.connection?.baseUrl} leave: ${data}`, leaveStyle)
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