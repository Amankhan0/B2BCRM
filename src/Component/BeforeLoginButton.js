import React from 'react'

function BeforeLoginButton({ title ,onClick}) {
    return (
        <div>
            <button
                className="btn border border-primary/30 bg-primary/10 font-medium text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:border-accent-light/30 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25 mt-3 transform transition-transform hover:scale-105"
                style={{ width: "100%" }}
                onClick={onClick}
            >
               {title}
            </button>
        </div>
    )
}

export default BeforeLoginButton;
