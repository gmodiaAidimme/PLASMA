import React from 'react';

function Loader(props) {
    return (
        <>
            {
                props.isLoading ?
                    <div style={{ height: props.height }}>
                        <div className="outer">
                            <div className="middle">
                                <div className="inner">
                                    <div className="d-flex justify-content-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        {props.children}
                    </>
            }
        </>
    )
}

export default Loader;