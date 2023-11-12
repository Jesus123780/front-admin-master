import { gql } from '@apollo/client';

export const DELETE_BANNERS = gql`
  mutation deleteOneBannerPromo($bpId: ID, $bpState: Int, $path: String) {
  deleteOneBannerPromo(bpId: $bpId, bpState: $bpState,  path: $path){
    success
    message
    
  }
}
`
export const DELETE_BANNERS_MASTER = gql`
mutation deleteOneBannerMaster($id: ID!) {
  deleteOneBannerMaster(id: $id)
}

`
