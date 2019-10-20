import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import Details from './Details';
import ActionHeader from '../../../components/ActionHeader';
import I18n from '../../../I18n';
import useApi from '../../../Hooks';
import { useParams, useHistory } from 'react-router';
import { toast } from 'react-toastify';

function NewProduct() {
  const t = useContext(I18n);
  type Image = {
    file: File;
    url: string;
  };
  const [images, setImages] = useState<Image[]>([]);
  const [infos, setInfos] = useState<{
    name: string;
    price: number;
    lpReward: number;
  }>({
    name: '',
    price: 0,
    lpReward: 0
  });

  const api = useApi();
  const params = useParams<{ id?: string }>();

  const deleteImages = (paths: string[]) => {
    api
      .delete(`/api/bo/products/${params.id}/images`, {
        json: {
          paths
        }
      })
      .then(d => d.json());
  };

  const isEdit = Boolean(params.id);
  const history = useHistory();
  const handleSubmit = () => {
    const formData = new FormData();

    images.filter(f => f.file).forEach(f => formData.append('image', f.file));
    formData.append('infos', JSON.stringify(infos));
    const action = isEdit ? api.put : api.post;
    const url = isEdit ? `/api/bo/products/${params.id}` : `/api/bo/products`;
    const successMsg = isEdit
      ? 'int.product-updated-successfully'
      : 'int.product-created-successfully';
    action(url, {
      body: formData
    }).then(() => {
      toast.success(successMsg);
      history.push('/products');
    });
  };

  return (
    <>
      <ActionHeader>
        <Button onClick={handleSubmit} variant="outlined">
          {t('int.save')}
        </Button>
      </ActionHeader>
      <br />
      <Grid container spacing={4}>
        <Grid item xl={6} lg={6} md={12} xs={12}>
          <Details infos={infos} setInfos={setInfos} />
        </Grid>
      </Grid>
    </>
  );
}

export default NewProduct;
