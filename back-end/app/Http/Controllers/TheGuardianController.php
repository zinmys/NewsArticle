<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TheGuardianController extends Controller
{
    private $params;

    public function __construct() 
    {
        $this->params = [
            'api-key' => '8f985624-afc3-475a-b925-78113f243cea',
            'show-fields' => 'thumbnail,trailText',
            'show-tags' => 'contributor',
            'order-by' => 'relevance',
            'page-size' => '20',
        ];
    }

    public function content(Request $request) 
    {
        $mappedResponse = [];
        $query = $request->all();
        $request->has('search')?$this->params['q'] = $query['search']:"";
        $request->has('category')?$this->params['section'] = $query['category']:"";
        $request->has('fromDate')?$this->params['from-date'] = $query['fromDate']:"";
        $request->has('toDate')?$this->params['to-date'] = $query['toDate']:"";
        $response = Http::get('https://content.guardianapis.com/search', $this->params);

        foreach(json_decode($response)->response->results as $article) 
        {
            $authors = [];
            foreach($article->tags as $tag) 
            {
                $authors[] = $tag->webTitle;
            }
            
            $mappedResponse[] = [
                'source' => 'The Guardian',
                'author' => $authors,
                'title' => strip_tags($article->webTitle),
                'description' => strip_tags($article->fields->trailText),
                'url' => $article->webUrl,
                'imageUrl' => $article->fields->thumbnail,
                'publishedAt' => $article->webPublicationDate
            ];
        }

        return $mappedResponse;
    }

    public function topHeadlines(Request $request) 
    {
        $mappedResponse = [];
        $query = $request->all();
        $request->has('fromDate')?$this->params['from-date'] = $query['fromDate']:"";
        $request->has('toDate')?$this->params['to-date'] = $query['toDate']:"";
        $request->has('pageSize')?$this->params['page-size'] = $query['pageSize']:"";
        $response = Http::get('https://content.guardianapis.com/world', $this->params);

        foreach(json_decode($response)->response->results as $article) 
        {
            $authors = [];
            foreach($article->tags as $tag) 
            {
                $authors[] = $tag->webTitle;
            }
            
            $mappedResponse[] = [
                'source' => 'The Guardian',
                'author' => $authors,
                'title' => strip_tags($article->webTitle),
                'description' => strip_tags($article->fields->trailText),
                'url' => $article->webUrl,
                'imageUrl' => $article->fields->thumbnail,
                'publishedAt' => $article->webPublicationDate
            ];
        }

        return $mappedResponse;
    }

    public function category(Request $request) 
    {
        $request->has('search')?$this->params['q'] = $query['search']:"";
        $response = Http::get('https://content.guardianapis.com/sections', $this->params);

        return json_decode($response)->response->results;
    }
    
}
