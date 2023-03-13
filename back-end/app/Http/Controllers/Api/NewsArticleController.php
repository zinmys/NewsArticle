<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NewsApiController;
use App\Http\Controllers\TheGuardianController;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NewsArticleController extends Controller
{
    public function __construct() 
    {
        $this->newsApi = new NewsApiController();
        $this->guardianApi = new TheGuardianController();
    }

    public function topNews(Request $request) 
    {
        $params = new Request([
            'search' => 'World',
            'pageSize' => $request->filled('pageSize')?$request->pageSize:'5',
        ]);
        $newsApiData = $this->newsApi->topHeadlines($params);
        $guardianApiData = $this->guardianApi->topHeadlines($params);

        $data = array_merge_recursive($guardianApiData, $newsApiData);
        usort($data, function($a, $b) {
            $t1 = strtotime($a['publishedAt']);
            $t2 = strtotime($b['publishedAt']);
            return $t2 > $t1;
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }

    public function recentNews(Request $request)
    {
        $today = Carbon::today();
        $params = new Request([
            'search' => 'a',
            'fromDate' => $today->subDays(7)->toDateString(),
            'toDate' => $today->toDateString()
        ]);

        $newsApiData = $this->newsApi->everything($params);
        $guardianApiData = $this->guardianApi->content($params);

        $data = array_merge_recursive($guardianApiData, $newsApiData);
        usort($data, function($a, $b) {
            $t1 = strtotime($a['publishedAt']);
            $t2 = strtotime($b['publishedAt']);
            return $t2 > $t1;
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }

    public function search(Request $request)
    {
        $rawParams = [
            'search' => $request->filled('query')?$request->get('query'):'a',
        ];
        $request->filled('category')?$rawParams['category'] = $request->get('category'):'';
        $request->filled('sources')?$rawParams['sources'] = $request->get('sources'):'';
        if ($request->filled('fromDate')) {
            $fromDate = new Carbon($request->get('fromDate'));
            $rawParams['fromDate'] = $fromDate->toDateString();
        }
        
        if ($request->filled('toDate')) {
            $toDate = new Carbon($request->get('toDate'));
            $rawParams['toDate'] = $toDate->toDateString();
        }
        
        $params = new Request($rawParams);

        $newsApiData = $this->newsApi->search($params);
        $guardianApiData = [];
        if ($request->filled('sources')) {
            $sources = explode(",",$request->get('sources'));
            if (in_array("the-guardian", $sources)) {
                $guardianApiData = $this->guardianApi->content($params);
            }
        }
        
        $data = array_merge_recursive($guardianApiData, $newsApiData);
        usort($data, function($a, $b) {
            $t1 = strtotime($a['publishedAt']);
            $t2 = strtotime($b['publishedAt']);
            return $t2 > $t1;
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }

    public function source(Request $request) 
    {
        $params = new Request();
        $source = $this->newsApi->sources($params);
        array_push($source, ['id' => 'the-guardian', 'name' => 'The Guardian']);
        return response()->json([
            'success' => true,
            'data'    => $source,
        ], 200);
    }

    public function category(Request $request)
    {
        $params = new Request();
        $category = $this->guardianApi->category($params);
        return response()->json([
            'success' => true,
            'data'    => $category,
        ], 200);
    }
}
