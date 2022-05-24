import React from 'react'
import usePreferredNetwork from '../lib/use-preferred-network'
import { useAccount, useNetwork } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval,
}: any) {
  const { data: account } = useAccount()
  const { isLoading, writeAsync } = action
  const onClick = async () => {
    preAction && preAction()
    const tx = await writeAsync()
    postAction && tx.hash && postAction()
  }

  const { activeChain } = useNetwork({})
  const { isPreferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork ? (
        <button className={className} disabled>
          {!activeChain?.id ? 'Not connected' : 'Wrong network'}
        </button>
      ) : !account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : isLoading ? (
        <div className={className}>
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      ) : approval ? (
        <ActionNeedsTokenApproval
          className={className}
          action={action}
          preAction={preAction}
          {...approval}
        >
          {children}
        </ActionNeedsTokenApproval>
      ) : (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      )}
    </>
  )
}
