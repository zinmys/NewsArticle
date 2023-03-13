<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class NewsApiController extends Controller
{
    private $params;

    public function __construct() 
    {
        $this->params = [
            'apiKey' => 'e12c324538f948c7ab555684c70c4fb1',
            'sortBy' => 'relevancy',
            'pageSize' => '20',
        ];
    }

    function everything(Request $request) 
    {
        $mappedResponse = [];
        $query = $request->all();
        $request->has('search')?$this->params['q'] = $query['search']:"";
        $request->has('sources')?$this->params['sources'] = $query['sources']:"";
        $request->has('fromDate')?$this->params['from'] = $query['fromDate']:"";
        $request->has('toDate')?$this->params['to'] = $query['toDate']:"";
        $response = Http::get('https://newsapi.org/v2/everything', $this->params);

        foreach(json_decode($response)->articles as $article) {
            $mappedResponse[] = [
                'source' => $article->source->name,
                'author' => [
                    $article->author
                ],
                'title' => strip_tags($article->title),
                'description' => strip_tags($article->description),
                'url' => $article->url,
                'imageUrl' => $article->urlToImage,
                'publishedAt' => $article->publishedAt
            ];
        }

        return $mappedResponse;
    }

     function topHeadlines(Request $request) 
     {
        $mappedResponse = [];
        $query = $request->all();
        $request->has('search')?$this->params['q'] = $query['search']:"";
        $request->has('category')?$this->params['category'] = $query['category']:"";
        $request->has('country')?$this->params['country'] = $query['country']:"";
        $request->has('sources')?$this->params['sources'] = $query['sources']:"";
        $request->has('pageSize')?$this->params['pageSize'] = $query['pageSize']:"";
        $response = Http::get('https://newsapi.org/v2/top-headlines', $this->params);

        foreach(json_decode($response)->articles as $article) {
            $mappedResponse[] = [
                'source' => $article->source->name,
                'author' => [
                    $article->author
                ],
                'title' => strip_tags($article->title),
                'description' => strip_tags($article->description),
                'url' => $article->url,
                'imageUrl' => $article->urlToImage,
                'publishedAt' => $article->publishedAt
            ];
        }

        return $mappedResponse;
     }

     function search(Request $request)
     {
        $mappedResponse = [];
        $response = [];

        $query = $request->all();
        $request->has('search')?$this->params['q'] = $query['search']:"";
        $request->has('category')?$this->params['category'] = $query['category']:"";
        $request->has('country')?$this->params['country'] = $query['country']:"";
        $request->has('sources')?$this->params['sources'] = $query['sources']:"";
        $request->has('pageSize')?$this->params['pageSize'] = $query['pageSize']:"";
        $request->has('fromDate')?$this->params['from'] = $query['fromDate']:"";
        $request->has('toDate')?$this->params['to'] = $query['toDate']:"";

        $responseA = Http::get('https://newsapi.org/v2/top-headlines', $this->params);
        $responseB = Http::get('https://newsapi.org/v2/everything', $this->params);

        $rawResponse = array_unique(array_merge(json_decode($responseA)->articles, json_decode($responseB)->articles), SORT_REGULAR);

        if ($request->has('fromDate') && $request->has('toDate')) {
            $fromDate = new Carbon($query['fromDate']);
            $fromDate = $fromDate->toDateString();

            $toDate = new Carbon($query['toDate']);
            $toDate = $toDate->toDateString();
        
            foreach ($rawResponse as $key => $data) {
                $dataDate = new Carbon($data->publishedAt);
                $dataDate = $dataDate->toDateString();

                if ($dataDate >= $fromDate && $dataDate <= $toDate) {
                    array_push($response, $data);
                }
            }
        } else {
            $response = $rawResponse;
        }
        

        foreach($response as $article) {
            $mappedResponse[] = [
                'source' => $article->source->name,
                'author' => [
                    $article->author
                ],
                'title' => strip_tags($article->title),
                'description' => strip_tags($article->description),
                'url' => $article->url,
                'imageUrl' => $article->urlToImage,
                'publishedAt' => $article->publishedAt
            ];
        }

        return $mappedResponse;
     }

     function sources(Request $request) 
     {
        $query = $request->all();
        $request->has('category')?$this->params['category'] = $query['category']:"";
        $request->has('country')?$this->params['country'] = $query['country']:"";
        $response = Http::get('https://newsapi.org/v2/top-headlines/sources', $this->params);

        return json_decode($response)->sources;
     }
}
